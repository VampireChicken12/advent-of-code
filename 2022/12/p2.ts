export default async (input: string) => {
	const grid = input.split("\n").map((r) => r.split(""));

	console.log(grid);
	type Point = { x: number; y: number };

	let start = { x: 0, y: 0 };
	let end = { x: 0, y: 0 };

	// Update start and end points
	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[y].length; x++) {
			const tile = grid[y][x];
			if (tile === "S") start = { x, y };
			if (tile === "E") end = { x, y };
		}
	}
	function letterToNumber(letter: string): number {
		if (["E", "S"].includes(letter)) {
			if (letter === "E") return 26;
			else return 1;
		}
		// Convert the letter to lowercase if it is uppercase
		letter = letter.toLowerCase();

		// Use the ASCII code of the letter to determine its position in the alphabet
		let asciiCode = letter.charCodeAt(0);

		// Subtract 96 from the ASCII code to get the number that the letter represents
		let number = asciiCode - 96;

		// Return the resulting number
		return number;
	}
	function allValidMoves(point: Point) {
		const { x, y } = point;

		const currentElevation = numberGrid[y][x];

		const allMoves = [
			{ x: x - 1, y },
			{ x: x + 1, y },
			{ x, y: y - 1 },
			{ x, y: y + 1 }
		];

		return allMoves.filter((move) => {
			const { x: x2, y: y2 } = move;

			if (x2 < 0 || y2 < 0) return false;
			if (x2 >= numberGrid[0].length || y2 >= numberGrid.length) return false;

			const newElevation = numberGrid[y2][x2];

			return newElevation >= currentElevation - 1;
		});
	}
	const numberGrid = grid.map((row) => row.map((tile) => letterToNumber(tile)));

	const visitedPoints: Set<string> = new Set([`${start.x},${start.y}`]);

	const pointToString = (point: Point) => `${point.x},${point.y}`;

	let Paths: Point[][] = [[end]];

	while (Paths.length > 0) {
		const newPaths: Point[][] = [];

		for (const path of Paths) {
			const lastPoint = path[path.length - 1];
			const validMoves = allValidMoves(lastPoint);

			for (const move of validMoves) {
				if (visitedPoints.has(pointToString(move))) continue;

				visitedPoints.add(pointToString(move));

				const newPath = [...path];
				newPath.push(move);
				const pathVal = numberGrid[move.y][move.x];
				if (pathVal === 1) {
					console.log("Solution Found", newPath.length - 1);
					process.exit();
				} else {
					newPaths.push(newPath);
				}
			}
		}

		Paths = newPaths;
	}
};
