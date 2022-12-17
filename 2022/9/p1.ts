import parseLines from "../../utils/parseLines";
export default async (input: string) => {
	const lines = parseLines(input);

	let tailPos = { x: 0, y: 0 };
	let headPos = { x: 0, y: 0 };

	let allPos = new Set<string>();

	const allPointsBetween = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
		const points = new Set<string>();

		let x = p1.x;
		let y = p1.y;

		let lastPoint = { x, y };

		while (x !== p2.x || y !== p2.y) {
			lastPoint = { x, y };
			points.add(`${x},${y}`);
			if (x < p2.x) {
				x++;
			} else if (x > p2.x) {
				x--;
			}

			if (y < p2.y) {
				y++;
			} else if (y > p2.y) {
				y--;
			}
		}

		return { points, lastPoint };
	};

	for (const line of lines) {
		const [dir, amount] = line.split(" ");

		const amountNum = parseInt(amount);

		console.log(dir, amountNum);

		let newPos = { x: headPos.x, y: headPos.y };
		if (dir === "L") {
			newPos.x -= amountNum;
		} else if (dir === "R") {
			newPos.x += amountNum;
		} else if (dir === "U") {
			newPos.y += amountNum;
		} else if (dir === "D") {
			newPos.y -= amountNum;
		}

		const { points, lastPoint } = allPointsBetween(tailPos, newPos);
		tailPos = lastPoint;
		headPos = newPos;

		points.forEach((p) => allPos.add(p));
	}

	console.log(allPos.size);
};
