import parseLines from "../../utils/parseLines";
import { max } from "../../utils/reducers";
import Timer from "../../utils/timer";

export default async (input: string) => {
	const day17Timer = new Timer("day 17");
	type Coordinate = number[];
	interface Caldera {
		rocks: Coordinate[];
		jets: number[];
		jetCursor: number;
	}

	const WIDTH = 7;
	const SHAPES = [
		[
			[0, 0],
			[1, 0],
			[2, 0],
			[3, 0]
		],
		[
			[1, 0],
			[0, 1],
			[1, 1],
			[2, 1],
			[1, 2]
		],
		[
			[0, 0],
			[1, 0],
			[2, 0],
			[2, 1],
			[2, 2]
		],
		[
			[0, 0],
			[0, 1],
			[0, 2],
			[0, 3]
		],
		[
			[0, 0],
			[1, 0],
			[0, 1],
			[1, 1]
		]
	];
	const isValidPosition =
		(rocks: Coordinate[], shape: Coordinate[]) =>
		([x, y]: Coordinate): boolean =>
			shape.map(([i, j]) => [x + i, y + j]).every(([i, j]) => i >= 0 && i < WIDTH && j >= 0 && !rocks.some(([rX, rY]) => rX === i && rY === j));
	const maxHeight = (rocks: Coordinate[]): number => rocks.map(([_, y]) => y).reduce(max, -1) + 1;
	const dropShape = ({ rocks, jets, jetCursor }: Caldera, shape: Coordinate[]): Caldera => {
		let cursor = jetCursor;
		let [x, y] = [2 + jets[cursor], maxHeight(rocks) + 3];
		cursor = (cursor + 1) % jets.length;

		const isValid = isValidPosition(rocks, shape);
		while (isValid([x, y - 1])) {
			y--;
			if (isValid([x + jets[cursor], y])) {
				x += jets[cursor];
			}
			cursor = (cursor + 1) % jets.length;
		}
		return {
			rocks: [...rocks, ...shape.map(([i, j]) => [i + x, j + y])],
			jets,
			jetCursor: cursor
		};
	};
	const jets = [...parseLines(input)[0]].map((jet) => (jet === ">" ? 1 : -1));
	let caldera: Caldera = { rocks: [], jets, jetCursor: 0 };

	for (let i = 0; i < 2022; i++) {
		const shape = SHAPES[i % SHAPES.length];
		caldera = dropShape(caldera, shape);
	}

	const answer = maxHeight(caldera.rocks);
	day17Timer.stop();
	console.log("(P1) Answer: " + answer);
};
