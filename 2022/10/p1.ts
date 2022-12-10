import { join } from "path";
import { readFile } from "fs/promises";

(async function () {
	// const input = await readFile(join(__dirname, "input_test.txt"), "utf-8");
	const input = await readFile(join(__dirname, "input_prod.txt"), "utf-8");
	const lines = input.split("\n");
	const instructions = [];
	let xReg = 1;
	for (let i = 0; i < lines.length; i++) {
		const [op, val] = lines[i].split(" ");
		if (op === "noop") {
			instructions.push(0);
		} else if (op === "addx") {
			instructions.push(0);
			instructions.push(parseInt(val));
		}
	}
	const totals = [];
	instructions.forEach((instruction, index) => {
		if ([20, 60, 100, 140, 180, 220].includes(index + 1)) {
			totals.push((index + 1) * xReg);
		}
		xReg += instruction;
	});
	const sum = totals.reduce((a, b) => a + b, 0);

	console.log(totals);
	console.log(sum);
})();
