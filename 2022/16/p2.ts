import parseLines from "../../utils/parseLines";
import { max, sum } from "../../utils/reducers";
import { descending } from "../../utils/sorters";
import Timer from "../../utils/timer";

interface Valve {
	flowRate: number;
	tunnels: string[];
}

type DistanceMap = Record<string, number>;

type ValveMap = Record<string, Valve>;
type DistanceTable = Record<string, DistanceMap>;
type Path = [string, number][];
const parseValves = (input: string): ValveMap => {
	const valves: ValveMap = {};
	for (const line of parseLines(input)) {
		const matches = line.match(/Valve (\w{1,2}?) has flow rate=(\d{1,2}); tunnels? leads? to valves? (.*)/);
		if (!matches) return;
		const name = matches[1];
		const flowRate = parseInt(matches[2]);
		const tunnels = matches[3].split(", ");
		valves[name] = { flowRate, tunnels };
	}

	return valves;
};

const pathsOverlap =
	(path1: Path) =>
	(path2: Path): boolean =>
		path1.slice(1).some(([name1]) => path2.some(([name2]) => name1 === name2));

const movementCosts =
	(valves: ValveMap) =>
	(from: string): DistanceMap => {
		let costs = { [from]: 0 };
		let updates = [from];

		while (updates.length > 0) {
			let newUpdates = [];
			for (const name of updates) {
				const uCost = costs[name];
				for (const tunnel of valves[name].tunnels) {
					if (costs[tunnel] === undefined || costs[tunnel] > uCost + 1) {
						costs[tunnel] = uCost + 1;
						newUpdates.push(tunnel);
					}
				}
			}
			updates = newUpdates;
		}

		const costMap = {};
		for (const [name, cost] of Object.entries(costs)) {
			if (name === from || valves[name].flowRate === 0) continue;
			costMap[name] = cost;
		}
		return costMap;
	};

const getPaths =
	(distances: DistanceTable) =>
	(from: string, minutesLeft: number, visited: string[]): Path[] => {
		const options = Object.keys(distances[from])
			.filter((next) => !visited.includes(next))
			.filter((next) => distances[from][next] <= minutesLeft);

		if (options.length === 0) {
			return [[[from, Math.max(minutesLeft, 0)]]];
		}

		return options.flatMap((next) =>
			getPaths(distances)(next, minutesLeft - distances[from][next] - 1, [...visited, next]).map((path) => [
				[from, minutesLeft] as [string, number],
				...path
			])
		);
	};

const evaluatePath =
	(valves: ValveMap) =>
	(path: Path): number =>
		path.map(([name, minutesLeft]) => valves[name].flowRate * minutesLeft).reduce(sum);

export default async (input: string) => {
	const benchmark = new Timer("day-16");

	const valves: ValveMap = parseValves(input);
	const distances: Record<string, DistanceMap> = {};

	console.log(valves);
	for (const name of Object.keys(valves)) {
		if (valves[name].flowRate > 0 || name === "AA") {
			distances[name] = movementCosts(valves)(name);
		}
	}
	const paths = getPaths(distances)("AA", 26, ["AA"]);

	const sortedPathsWithScores = paths
		.map((path) => ({ path, score: evaluatePath(valves)(path) }))
		.sort(({ score: s1 }, { score: s2 }) => descending(s1, s2));

	const { path: bestPath, score: bestScore } = sortedPathsWithScores[0];
	const { score: bestNonOverlapping } = sortedPathsWithScores.filter(({ path }) => !pathsOverlap(bestPath)(path))[0];

	const lowerBound = bestScore + bestNonOverlapping;

	const maxPressure = sortedPathsWithScores
		.flatMap(({ path: path1, score: score1 }) =>
			sortedPathsWithScores
				.filter(({ score: score2 }) => score1 + score2 >= lowerBound)
				.filter(({ path: path2 }) => !pathsOverlap(path1)(path2))
				.map(({ score: score2 }) => score1 + score2)
		)
		.reduce(max);

	console.log("(P2) Answer: " + maxPressure);
	benchmark.stop();
};
