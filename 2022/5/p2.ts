import { join } from "path";
import { readFile } from "fs/promises";

(async function () {
	const input = await readFile(join(__dirname, "input_prod.txt"), "utf-8");
	const [rawInputStacksOfCrates, rawMoveInstructions] = input.split("\n\n");
	// console.log(rawInputStacksOfCrates);
	// console.log(rawMoveInstructions);
	const parsedInputStacksOfCrates = rawInputStacksOfCrates.split("\n").reverse().slice(1);
	const stackNumbers = rawInputStacksOfCrates.split("\n").pop();
	console.log(parsedInputStacksOfCrates);
	const stackOfCrates = [];
	for (let i = 0; i < (parsedInputStacksOfCrates[0].length + 1) / 4; i++) {
		stackOfCrates.push(parsedInputStacksOfCrates.map((v) => v.slice(i * 4, i * 4 + 3)));
	}
	const clearEmptyStrings = () => {
		stackOfCrates.forEach((stack) => {
			while (stack[stack.length - 1] === "   ") {
				stack.pop();
			}
		});
	};
	clearEmptyStrings();
	console.log(stackOfCrates);
	const printStacks = () => {
		const rows = [];
		for (let i = 0; i < 10; i++) {
			let row = "";
			for (let j = 0; j < stackOfCrates.length; j++) {
				row += stackOfCrates[j][i] ?? "   ";
				row += " ";
			}
			rows.push(row);
		}
		console.log(rows.reverse().join("\n"));
		console.log(stackNumbers);
	};
	console.log("Original crates");
	printStacks();

	const parsedInstructions = rawMoveInstructions.split("\n").map((line) => {
		const [, amount, from, to] = line.match(/move\s(\d+)\sfrom\s(\d+)\sto\s(\d+)/);
		return [parseInt(amount), parseInt(from) - 1, parseInt(to) - 1];
	});

	// console.log(parsedInstructions);

	parsedInstructions.forEach(([amount_, from_, to_]) => {
		console.log("from: ", from_, " to ", to_, "amount ", amount_);
		printStacks();
		const crates = stackOfCrates[from_].splice(stackOfCrates[from_].length - amount_);
		console.log("\n\n");
		console.log("crates ", crates);
		stackOfCrates[to_] = stackOfCrates[to_].concat(crates);
	});
	printStacks();
	console.log(stackOfCrates.map((stack) => stack[stack.length - 1].replace(/[\[(.*)\]]/g, "")).join(""));
})();
