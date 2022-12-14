import parseLines from "../../utils/parseLines";
import Timer from "../../utils/timer";

type Resource = "ore" | "clay" | "obsidian" | "geode";
type Row<T> = [T, T, T, T];
type Counts = Row<number>;

const [ORE, CLAY, OBSIDIAN, GEODE] = [0, 1, 2, 3] as const;
const Resources = [ORE, CLAY, OBSIDIAN, GEODE];
const ResourceIds = {
	ore: ORE,
	clay: CLAY,
	obsidian: OBSIDIAN,
	geode: GEODE
};

interface State {
	robots: Counts;
	resources: Counts;
	minute: number;
	timeLimit: number;
}

interface ScoredState extends State {
	id: string;
	optimisticScore: number;
}
function zeros() {
	return new Array(4).fill(0) as Counts;
}
function addType(typeToAdd: number, counts: Counts) {
	return counts.map((count, type) => (type === typeToAdd ? count + 1 : count)) as Counts;
}

function add(counts1: Counts, counts2: Counts) {
	return counts1.map((count, type) => count + counts2[type]) as Counts;
}

function sub(counts1: Counts, counts2: Counts) {
	return counts1.map((count, type) => count - counts2[type]) as Counts;
}

function mul(counts: Counts, n: number) {
	return counts.map((count) => count * n) as Counts;
}

function stateId({ robots, resources }: State) {
	return `${robots.join(",")}:${resources.join(",")}`;
}
function calculateOptimisticScore({ robots, minute, resources, timeLimit }: State) {
	let nGeodes = resources[GEODE] ?? 0;
	let nGeodeRobots = robots[GEODE] ?? 0;
	for (let i = minute; i < timeLimit; i++) {
		nGeodes += nGeodeRobots;
		nGeodeRobots++;
	}
	return nGeodes;
}

function withScore(state: State): ScoredState {
	return {
		...state,
		id: stateId(state),
		optimisticScore: calculateOptimisticScore(state)
	};
}
function initialState({ timeLimit }: { timeLimit: number }): State {
	return {
		robots: addType(ORE, zeros()),
		resources: zeros(),
		minute: 0,
		timeLimit
	};
}
class Blueprint {
	id: number;
	robotCosts: Row<Counts>;
	maxRobotsNeeded: Counts;
	maxGeodes = 0;
	maxGeodesByStateId: Record<string, number> = {};
	bestOptimisticScoreByStateId: Record<string, number> = {};
	queue: ScoredState[] = [];
	private externalMax: number = 0;

	constructor(private readonly blueprint: string) {
		const [match = "", idString] = blueprint.match(/Blueprint (\d*): /) ?? [];
		this.id = parseInt(idString, 10);
		if (Number.isNaN(this.id)) {
			throw new Error(`Invalid blueprint ID ${idString}`);
		}

		this.robotCosts = [zeros(), zeros(), zeros(), zeros()];

		blueprint
			.slice(match.length)
			.split(". ")
			.map((robotBlueprint) => {
				const [match = "", name] = robotBlueprint.match(/Each (\w*) robot costs /) ?? [];
				const costs = zeros();
				robotBlueprint
					.slice(match.length)
					.replace(/\.$/, "")
					.split(" and ")
					.forEach((costString) => {
						const [cost, resource] = costString.split(" ");
						costs[ResourceIds[resource as Resource]] = parseInt(cost, 10);
					});
				this.robotCosts[ResourceIds[name as Resource]] = costs;
			});

		this.maxRobotsNeeded = [
			Math.max(
				this.robotCosts[ORE][ORE] ?? 0,
				this.robotCosts[CLAY][ORE] ?? 0,
				this.robotCosts[OBSIDIAN][ORE] ?? 0,
				this.robotCosts[GEODE][ORE] ?? 0
			),
			this.robotCosts[OBSIDIAN][CLAY] ?? 0,
			this.robotCosts[GEODE][OBSIDIAN] ?? 0,
			Infinity
		];
	}

	getNextStates({ minute, resources, robots, timeLimit }: State) {
		const nextStates: State[] = [];

		if (minute < timeLimit) {
			if (robots[GEODE]) {
				nextStates.push({
					robots,
					resources: add(resources, mul(robots, timeLimit - minute)),
					minute: timeLimit,
					timeLimit
				});
			}
			robots.forEach((robotCount, type) => {
				const resourcesNeeded = this.robotCosts[type];
				if (robotCount >= this.maxRobotsNeeded[type] || resourcesNeeded.some((n, typeNeeded) => n && !robots[typeNeeded])) {
					return;
				}
				const nWaitRounds = Math.max(
					...resourcesNeeded.map((nResource, iType) => (robots[iType] ? Math.ceil(Math.max(0, nResource - resources[iType]) / robots[iType]) : 0))
				);
				const minuteAfterBuild = minute + nWaitRounds + 1;
				const resourcesAfterWait = add(resources, mul(robots, nWaitRounds));
				nextStates.push({
					robots: addType(type, robots),
					resources: add(sub(resourcesAfterWait, resourcesNeeded), robots),
					minute: minuteAfterBuild,
					timeLimit
				});
			});
		}

		return nextStates;
	}

	isGoodState(state: ScoredState) {
		const { id, minute, resources, optimisticScore, timeLimit } = state;
		const nGeodes = resources[GEODE];
		return (
			nGeodes >= (this.maxGeodesByStateId[id] ?? 0) &&
			(minute < timeLimit || (optimisticScore > 0 && minute === timeLimit)) &&
			optimisticScore >= (this.bestOptimisticScoreByStateId[id] ?? 0) &&
			optimisticScore >= this.maxGeodes &&
			optimisticScore >= this.externalMax
		);
	}

	queueState(state: State) {
		const scoredState = withScore(state);
		const { id, resources, optimisticScore } = scoredState;

		if (!this.isGoodState(scoredState)) return;

		this.maxGeodesByStateId[id] = Math.max(this.maxGeodesByStateId[id] ?? 0, resources[GEODE]);
		this.bestOptimisticScoreByStateId[id] = Math.max(this.bestOptimisticScoreByStateId[id] ?? 0, optimisticScore);
		this.queue.push(scoredState);
		this.maxGeodes = Math.max(this.maxGeodes, resources[GEODE]);
	}

	findMaxGeodes({ timeLimit, externalMax = 0 }: { timeLimit: number; externalMax?: number }) {
		this.queue = [withScore(initialState({ timeLimit }))];

		console.log(`Finding max in Blueprint ${this.id}`);
		this.externalMax = externalMax;
		while (this.queue.length) {
			const state = this.queue.pop() as ScoredState;

			if (this.queue.length && this.queue.length % 10000 === 0) {
				this.queue = this.queue.filter((state) => this.isGoodState(state));
			}

			const nextStates = this.getNextStates(state);

			nextStates.forEach((state) => this.queueState(state));
		}
		return this.maxGeodes;
	}
}
export default async (input: string) => {
	const day19Timer = new Timer("day 19");
	const lines = parseLines(input);
	const blueprints = lines.map((line) => new Blueprint(line));
	const maxes = blueprints.slice(0, 3).map((blueprint) =>
		blueprint.findMaxGeodes({
			timeLimit: 32
		})
	);
	day19Timer.stop();
	console.log(
		"P2 Answer: ",
		maxes.reduce((product, max) => product * max, 1)
	);
};
