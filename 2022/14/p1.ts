export default async (input: string) => {
	type Point = [number, number];
	const points = input
		.split("\n")
		.map((line) => line.split(" -> "))
		.map((l) => l.map((s) => s.split(",").map((i) => parseInt(i)) as Point));

	function tick(grid: string[][], sand: Point): boolean {
		const [x, y] = sand;

		if (y === grid.length - 1 || y < 0 || x > grid[0].length - 1 || x < 0 || grid[y][x] === "o") {
			return true;
		}
		if (grid[y + 1][x] === ".") {
			return tick(grid, [x, y + 1]);
		}

		if (grid[y + 1][x - 1] === ".") {
			return tick(grid, [x - 1, y]);
		}

		if (grid[y + 1][x + 1] === ".") {
			return tick(grid, [x + 1, y]);
		}

		grid[y][x] = "o";
		return false;
	}

	const xMax = Math.max(...points.flat(1).map((p) => p[0]));
	const yMax = Math.max(...points.flat(1).map((p) => p[1]));
	const caveMatrix = Array.from({ length: yMax + 1 }, () => Array.from({ length: xMax }, () => "."));

	points.forEach((path) => {
		for (let i = 1; i < path.length; i++) {
			const [x1, y1] = path[i];
			const [x2, y2] = path[i - 1];
			const xChanged = x1 !== x2;
			const [min, max] = xChanged ? [x1, x2].sort((a, b) => a - b) : [y1, y2].sort((a, b) => a - b);

			for (let i = min; i <= max; i++) {
				caveMatrix[xChanged ? y1 : i][xChanged ? i : x1] = "#";
			}
		}
	});

	function simulate(cave: string[][]) {
		const x = 500;
		caveMatrix[0][x] = "+";
		let count = 0;
		try {
			while (!tick(cave, [x, 0])) {
				count++;
			}
		} catch {
			return count - 5;
		}
		return count - 5;
	}

	console.log(simulate(caveMatrix));
	console.log(caveMatrix.map((i) => i.join("")).join("\n"));
};
