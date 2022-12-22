import parseLines from "../../utils/parseLines";
export default async (input: string) => {
	const lines = parseLines(input);
	const numbers = lines.map((string, index) => ({ index, value: Number(string) * 811589153 }));
	const n = numbers.length;
	const originalOrder = [...numbers];

	new Array(10).fill(1).forEach(() => {
		originalOrder.forEach((current) => {
			const index = numbers.findIndex((item) => item.index === current.index);
			numbers.splice(index, 1);

			const newIndex = (index + current.value) % (n - 1);
			numbers.splice(newIndex, 0, current);
		});
	});

	const zeroPos = numbers.findIndex((number) => number.value === 0);
	const coords = [numbers[(zeroPos + 1000) % n], numbers[(zeroPos + 2000) % n], numbers[(zeroPos + 3000) % n]];

	const sum = coords.reduce((a, b) => a + b.value, 0);
	console.log(sum);
};
