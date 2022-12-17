import parseLines from "../../utils/parseLines";
export default async (input: string) => {
	type Coord = [number, number];
	type Range = [number, number];

	function rangeSize(range: Range) {
		return Math.abs(range[1] - range[0]) + 1;
	}

	function unionRange(range1: Range, range2: Range): Range | false {
		if ((range1[0] <= range2[1] && range1[1] >= range2[0]) || (range2[0] <= range1[1] && range2[1] >= range1[0])) {
			return [Math.min(range1[0], range2[0]), Math.max(range1[1], range2[1])];
		}
		return false;
	}

	function parseInstruction(line: string) {
		const parts = line.split(": ");
		const coordString = parts[0].split(", ");
		const coords: Coord = [parseInt(coordString[0].replace("Sensor at x=", "")), parseInt(coordString[1].replace("y=", ""))];
		const beaconString = parts[1].split(", ");
		const beaconCoords: Coord = [parseInt(beaconString[0].replace("closest beacon is at x=", "")), parseInt(beaconString[1].replace("y=", ""))];
		return {
			sensor: coords,
			beacon: beaconCoords
		};
	}

	function manhattanDistance(point1: Coord, point2: Coord) {
		return Math.abs(point1[0] - point2[0]) + Math.abs(point1[1] - point2[1]);
	}

	function updateRanges(map: Record<number, Range[]>, y: number, range: Range) {
		let newArray = [];
		let newRange = range;
		for (const otherRange of map[y]) {
			const unioned = unionRange(newRange, otherRange);
			if (!unioned) {
				newArray.push(otherRange);
			} else {
				newRange = unioned;
			}
		}
		newArray.push(newRange);
		newArray.sort((a, b) => a[0] - b[0]);
		map[y] = newArray;
	}

	function updateMap(map: Record<number, Range[]>, { beacon, sensor }: ReturnType<typeof parseInstruction>) {
		const distance = manhattanDistance(beacon, sensor);

		for (let y = sensor[1] - distance; y <= sensor[1] + distance; y++) {
			if (y === 2000000) {
				const currentDistance = manhattanDistance(sensor, [sensor[0], y]);
				if (!map[y]) map[y] = [];

				const startRange = sensor[0] - distance + currentDistance;
				const endRange = sensor[0] + distance - currentDistance;
				if (beacon[1] === y) {
					if (startRange === endRange) {
						continue;
					}
					if (beacon[0] === startRange) {
						updateRanges(map, y, [startRange + 1, endRange]);
					} else {
						updateRanges(map, y, [startRange, endRange - 1]);
					}
				} else {
					updateRanges(map, y, [startRange, endRange]);
				}
			}
		}
	}
	const lines = parseLines(input);
	const map: Record<number, Range[]> = {};
	for (const line of lines) {
		const instruction = parseInstruction(line);
		updateMap(map, instruction);
	}
	console.log(
		map[2000000].reduce((prev, curr) => {
			return prev + rangeSize(curr);
		}, 0)
	);
};
