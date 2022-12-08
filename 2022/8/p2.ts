import { join } from "path";
import { readFile } from "fs/promises";

(async function () {
	// const input = await readFile(join(__dirname, "input_test.txt"), "utf-8");
	const input = await readFile(join(__dirname, "input_prod.txt"), "utf-8");
	function parseGrid(input: string): number[][] {
		return input
			.split("\n") // split the input string into an array of strings
			.map((s) => s.split("").map(Number)); // split each string into an array of numbers and convert them to numbers
	}
	let bestScore = 0;
	const grid = parseGrid(input);
	function treeIsVisible(x: number, y: number) {
		let treeHeight = grid[x][y];
		let a = 0;
		let right = 0;
		let up = 0;
		let down = 0;
		for (let row = x - 1; row >= 0; row--) {
			a++;
			const num = grid[row][y];
			if (num >= treeHeight) break;
		}

		for (let row = x + 1; row < grid.length; row++) {
			right++;
			const num = grid[row][y];
			if (num >= treeHeight) break;
		}

		for (let col = y - 1; col >= 0; col--) {
			up++;
			const num = grid[x][col];
			if (num >= treeHeight) break;
		}

		for (let col = y + 1; col < grid[x].length; col++) {
			down++;
			const num = grid[x][col];
			if (num >= treeHeight) break;
		}
		const score = a * right * up * down;
		if (score > bestScore) bestScore = score;
	}

	function findBestTreeSpot(grid: number[][]) {
		// Check each tree in the grid
		for (let x = 0; x < grid.length; x++) {
			for (let y = 0; y < grid[x].length; y++) {
				treeIsVisible(x, y);
			}
		}
		return bestScore;
	}

	console.log(findBestTreeSpot(grid));
})();
