type Dir = {
	parent?: Dir;
	files: { [name: string]: number };
	dirs: { [name: string]: Dir };
};

export default async (input: string) => {
	const dirSizes: number[] = [];
	const computeFileSize = (curr: Dir): number => {
		let size = 0;

		for (const file in curr.files) {
			size += curr.files[file];
		}

		for (const dir in curr.dirs) {
			const dirSize = computeFileSize(curr.dirs[dir]);
			size += dirSize;

			dirSizes.push(dirSize);
		}

		return size;
	};
	const parseInput = (input: string) => {
		// Split input into lines
		const lines = input.split("\n");

		// Initialize variables to keep track of current directory, list of files and their sizes, and directories
		const fileMap: Dir = { files: {}, dirs: {} };
		let currentDir = fileMap;

		// Loop through each line of input
		for (const line of lines) {
			// Split line into command and arguments
			const [cmd, ...rest] = line.split(" ");
			if (cmd === "$") {
				// Handle "cd" command
				if (rest[0] === "cd") {
					const dir = rest[1];
					if (dir === "..") {
						currentDir = currentDir.parent;
					} else if (dir === "/") {
						currentDir = fileMap;
					} else {
						if (!currentDir.dirs[dir]) {
							currentDir.dirs[dir] = { parent: currentDir, files: {}, dirs: {} };
						}
						currentDir = currentDir.dirs[dir];
					}
				}
			} else if (cmd !== "dir") {
				// handle ls entry
				const file = rest[0];
				currentDir.files[file] = parseInt(cmd);
			}
		}

		const rootSize = computeFileSize(fileMap);
		// Find directories greater than or equal to update size
		const bigDirs = dirSizes.filter((dir) => dir >= 30000000 - (70000000 - rootSize));
		// Find all directories with total size <= 100000
		const smallDirs = dirSizes.filter((dir) => dir <= 100000).sort((a, b) => a - b);

		// Calculate sum of total sizes of small directories
		const totalSize = smallDirs.reduce((sum, dir) => sum + dir, 0);

		const smallestThatFixesSpace = Math.min(...dirSizes.filter((x) => x >= 30000000 - (70000000 - rootSize)));
		// Print list of small directories and total size
		console.log("Small directories:", smallDirs.join(", "));
		console.log("Big directories:", bigDirs.join(", "));
		console.log("Smallest that fixes space:", smallestThatFixesSpace);
		console.log("Total size:", totalSize);
	};
	parseInput(input);
};
