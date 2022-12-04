import { join } from "path";
import { readFile } from "fs/promises";
const itemRearrangementPriority = {
	a: 1,
	b: 2,
	c: 3,
	d: 4,
	e: 5,
	f: 6,
	g: 7,
	h: 8,
	i: 9,
	j: 10,
	k: 11,
	l: 12,
	m: 13,
	n: 14,
	o: 15,
	p: 16,
	q: 17,
	r: 18,
	s: 19,
	t: 20,
	u: 21,
	v: 22,
	w: 23,
	x: 24,
	y: 25,
	z: 26,
	A: 27,
	B: 28,
	C: 29,
	D: 30,
	E: 31,
	F: 32,
	G: 33,
	H: 34,
	I: 35,
	J: 36,
	K: 37,
	L: 38,
	M: 39,
	N: 40,
	O: 41,
	P: 42,
	Q: 43,
	R: 44,
	S: 45,
	T: 46,
	U: 47,
	V: 48,
	W: 49,
	X: 50,
	Y: 51,
	Z: 52
} as const;
(async () => {
	const input = await readFile(join(__dirname, "input_prod.txt"), "utf-8");
	const ruckSackLines = input.split("\n").filter(Boolean);
	const elfRuckSackGroups: string[][] = [];
	for (let i = 0, pos = 0; i < ruckSackLines.length; i += 3) {
		if (!elfRuckSackGroups[pos]) {
			elfRuckSackGroups.push(ruckSackLines.slice(i, i + 3));
			pos += 1;
		}
	}
	console.log(JSON.stringify(ruckSackLines, null, 2));
	console.log(JSON.stringify(elfRuckSackGroups, null, 2));

	const bothCompartmentRuckSacks = elfRuckSackGroups.map(([part1, part2, part3]) => {
		const part1Chars = part1.split("");
		const part2Chars = part2.split("");
		const part3Chars = part3.split("");
		const sharedBetweenAll = part1Chars.filter((char) => part2Chars.includes(char) && part3Chars.includes(char));
		return Array.from(new Set(...sharedBetweenAll));
	});
	console.log(JSON.stringify(bothCompartmentRuckSacks, null, 2));
	const sharedItemsPrioritySum = bothCompartmentRuckSacks
		.flat()
		.map((item) => itemRearrangementPriority[item])
		.reduce((a, b) => a + b);
	console.log("Sum of shared items:  ", sharedItemsPrioritySum);
})();
