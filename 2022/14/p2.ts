import { join } from "path";
import { readFile } from "fs/promises";

(async function () {
	// const input = await readFile(join(__dirname, "input_test.txt"), "utf-8");
	const input = await readFile(join(__dirname, "input_prod.txt"), "utf-8");
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

	const caveMatrix = Array.from({ length: yMax + 1 }, () => Array.from({ length: xMax * 2 }, () => ".")).concat(
		Array.from({ length: 2 }, (_, i) => Array.from({ length: xMax * 2 }, () => (i ? "#" : ".")))
	);

	points.forEach((path) => {
		for (let i = 1; i < path.length; i++) {
			const [x1, y1] = path[i];
			const [x2, y2] = path[i - 1];
			const changed = x1 !== x2;
			const [min, max] = changed ? [x1, x2].sort((a, b) => a - b) : [y1, y2].sort((a, b) => a - b);
			for (let i = min; i <= max; i++) caveMatrix[changed ? y1 : i][changed ? i : x1] = "#";
		}
	});

	function fillCaveCompletely(grid: string[][]) {
		grid[0][500] = "+";

		let count = 0;
		try {
			while (!tick(grid, [500, 0])) {
				count++;
			}
		} catch {
			return count;
		}
		return count;
	}

	console.log(fillCaveCompletely(caveMatrix));
})();
