export default async (input: string) => {
	function parseGrid(input: string): number[][] {
		return input
			.split("\n") // split the input string into an array of strings
			.map((s) => s.split("").map(Number)); // split each string into an array of numbers and convert them to numbers
	}

	const grid = parseGrid(input);
	function treeIsVisible(x: number, y: number): boolean {
		let treeHeight = grid[x][y];
		let visible = true;
		for (let row = 0; row < x; row++) {
			const num = grid[row][y];
			if (row === x) continue;
			if (num >= treeHeight) visible = false;
		}

		if (visible) return true;

		visible = true;
		for (let row = x; row < grid.length; row++) {
			const num = grid[row][y];
			if (row === x) continue;
			if (num >= treeHeight) visible = false;
		}

		if (visible) return true;

		visible = true;
		for (let col = 0; col < y; col++) {
			const num = grid[x][col];
			if (col === y) continue;
			if (num >= treeHeight) visible = false;
		}

		if (visible) return true;

		visible = true;
		for (let col = y; col < grid[x].length; col++) {
			const num = grid[x][col];
			if (col === y) continue;
			if (num >= treeHeight) visible = false;
		}

		if (visible) return true;
		return false;
	}

	function countVisibleTrees(grid: number[][]) {
		let count = 0;

		// Check each tree in the grid
		for (let x = 0; x < grid.length; x++) {
			for (let y = 0; y < grid[x].length; y++) {
				if (treeIsVisible(x, y)) {
					count++;
				}
			}
		}

		return count;
	}

	console.log(countVisibleTrees(grid));
};
