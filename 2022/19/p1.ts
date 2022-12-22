import { range } from "../../utils/numbers";
import parseLines from "../../utils/parseLines";
import { max, sum } from "../../utils/reducers";
type Cost = [number, number, number];
type Blueprint = [Cost, Cost, Cost, Cost];
const [ORE, CLAY, OBSIDIAN, GEODE] = [0, 1, 2, 3];

interface State {
	minutesRemaining: number;
	resources: number[];
	robots: number[];
}

export default async (input: string) => {
	const lines = parseLines(input);
	console.log(lines);
	const blueprints = lines.map(parseBlueprint);
	console.log("(P1) Answer: " + blueprints.map((b, i) => (i + 1) * mostGeodes(b, i + 1, 24)).reduce(sum));
};
const parseBlueprint = (line: string): Blueprint => {
	const [oreString, clayString, obsidianString, geodeString] = line.split(": ")[1].split(". ");

	const oreRobot: Cost = [parseInt(oreString.split(" ")[4]), 0, 0];
	const clayRobot: Cost = [parseInt(clayString.split(" ")[4]), 0, 0];
	const obsidianRobot: Cost = [parseInt(obsidianString.split(" ")[4]), parseInt(obsidianString.split(" ")[7]), 0];
	const geodeRobot: Cost = [parseInt(geodeString.split(" ")[4]), 0, parseInt(geodeString.split(" ")[7])];
	return [oreRobot, clayRobot, obsidianRobot, geodeRobot];
};
const mostGeodes = (blueprint: Blueprint, id: number, time: number): number => {
	const start: State = { minutesRemaining: time, resources: [0, 0, 0, 0], robots: [1, 0, 0, 0] };
	const maxNeeded = range(0, 3).map((i) => blueprint.map((b) => b[i]).reduce(max));

	let seen: Set<string> = new Set([JSON.stringify(start)]);
	let todo: State[] = [start];
	let best = 0;

	searchLoop: while (todo.length > 0) {
		const state = todo.pop();

		if (best >= theoreticalBest(state)) {
			continue searchLoop;
		}

		best = Math.max(best, geodesAtEnd(state));

		const { robots, resources, minutesRemaining } = state;

		range(0, 4)
			.filter((resource) => resource === GEODE || robots[resource] < maxNeeded[resource])
			.filter((resource) => zip(resources, robots, blueprint[resource]).some(([stock, prod, cost]) => stock - prod < cost))
			.map((resource) => [resource, calcTurnsUntilCanBuild(resources, robots)(blueprint[resource])])
			.filter(([_, turns]) => turns < minutesRemaining)
			.map(
				([resource, turns]): State => ({
					resources: zip(resources, robots, blueprint[resource]).map(([res, rob, cost]) => res + turns * rob - (cost || 0)),
					robots: robots.map((r, i) => (i === resource ? r + 1 : r)),
					minutesRemaining: minutesRemaining - turns
				})
			)
			.filter((s) => !seen.has(JSON.stringify(s)))
			.forEach((s) => {
				todo.push(s);
				seen.add(JSON.stringify(s));
			});
	}

	console.log(`Blueprint ${id}: ${best}`);
	return best;
};

const geodesAtEnd = ({ resources, robots, minutesRemaining }: State): number => resources[GEODE] + minutesRemaining * robots[GEODE];

const theoreticalBest = ({ resources, robots, minutesRemaining }: State): number =>
	geodesAtEnd({ resources, robots, minutesRemaining }) + 0.5 * minutesRemaining * (minutesRemaining - 1);

const zip = (...arrays: number[][]): number[][] => arrays[0].map((_, i) => arrays.map((array) => array[i]));

const calcTurnsUntilCanBuild = (resources: number[], robots: number[]) => (cost: Cost) =>
	zip(resources, robots, cost)
		.map(([re, ro, c]) => Math.ceil((c - re) / ro))
		.filter((x) => !isNaN(x))
		.reduce(max) + 1;
