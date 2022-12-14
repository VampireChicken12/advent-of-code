import parseLines from "../../utils/parseLines";
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
export default async (input: string) => {
	const rucksacks = parseLines(input).filter((rucksack) => rucksack !== "");
	console.log(rucksacks);
	const splitRuckSacks = rucksacks.map((rucksack) => {
		return [rucksack.slice(0, rucksack.length / 2), rucksack.replace(rucksack.slice(0, rucksack.length / 2), "")];
	});
	console.log(JSON.stringify(splitRuckSacks, null, 2));
	const bothCompartmentRuckSacks = splitRuckSacks.map(([part1, part2]) => {
		const part1Chars = part1.split("");
		const part2Chars = part2.split("");
		const sharedItems = part1Chars.filter((char) => part2Chars.includes(char));
		return Array.from(new Set(...sharedItems));
	});
	console.log(JSON.stringify(bothCompartmentRuckSacks, null, 2));
	const sharedItemsPrioritySum = bothCompartmentRuckSacks
		.flat()
		.map((item) => itemRearrangementPriority[item])
		.reduce((a, b) => a + b);
	console.log("Sum of shared items:  ", sharedItemsPrioritySum);
};
