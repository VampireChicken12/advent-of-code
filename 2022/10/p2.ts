export default async (input: string) => {
	const lines = input.split("\n");
	const instructions = [];
	let xReg = 1;
	for (let i = 0; i < lines.length; i++) {
		instructions.push(0);
		const [op, val] = lines[i].split(" ");
		if (op === "addx") {
			instructions.push(parseInt(val));
		}
	}
	const grid: string[][] = Array.from({ length: 6 }, () => new Array(40).fill(" "));
	instructions.forEach((instruction, index) => {
		const [dx, dy] = [index % 40, Math.floor(index / 40)];
		const shouldDraw = dx === xReg || dx === xReg - 1 || dx === xReg + 1;
		grid[dy][dx] = shouldDraw ? "#" : " ";
		xReg += instruction;
	});
	console.log(grid.map((row) => row.join("")).join("\n"));
};
