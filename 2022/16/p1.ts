import parseLines from "../../utils/parseLines";
import { max, sum } from "../../utils/reducers";
import Timer from "../../utils/timer";

interface Valve {
	flowRate: number;
	tunnels: string[];
}

type ValveMap = Record<string, Valve>;
type DistanceMap = Record<string, number>;
type Path = [string, number][];
const parseValves = (input: string): ValveMap => {
	const valves: ValveMap = {};
	for (const line of parseLines(input)) {
		const matches = line.match(/Valve (\w{1,2}?) has flow rate=(\d{1,2}); tunnels? leads? to valves? (.*)/);
		if (!matches) return;
		const valve = matches[1];
		const flowRate = parseInt(matches[2]);
		const tunnels = matches[3].split(", ");
		valves[valve] = { flowRate, tunnels };
	}

	return valves;
};

const movementCosts =
	(valves: ValveMap) =>
	(from: string): DistanceMap => {
		const costs = { [from]: 0 };
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
	(distances: { [k: string]: DistanceMap }) =>
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

	const valves: Record<string, Valve> = parseValves(input);
	const distances: Record<string, DistanceMap> = {};

	console.log(valves);
	for (const name of Object.keys(valves)) {
		if (valves[name].flowRate > 0 || name === "AA") {
			distances[name] = movementCosts(valves)(name);
		}
	}
	console.log("Distance map between non zero valves (and start) calculated");
	const paths = getPaths(distances)("AA", 30, ["AA"]);
	console.log(paths.length + " possible paths between valves found");

	const maxPressure = paths.map(evaluatePath(valves)).reduce(max);
	benchmark.stop();
	console.log("(P1) Answer: " + maxPressure);
};
