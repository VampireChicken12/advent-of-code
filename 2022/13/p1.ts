export default async (input: string) => {
	const lists = input.split("\n\n");

	type Base = number | number[];
	type Node = Base | Base[];

	const convertTypes = (n: Node) => {
		return typeof n === "number" ? [n] : n;
	};

	const parsed = lists.map((group) => {
		const lines = group.split("\n");
		const nodes = lines.map((line) => {
			return JSON.parse(line);
		});
		return nodes as [Node[], Node[]];
	});

	function compare(left: Node, right: Node): boolean | undefined {
		if (Array.isArray(left) && Array.isArray(right)) {
			for (let i = 0; i < left.length && i < right.length; i++) {
				const c = compare(left[i], right[i]);
				if (c !== undefined) {
					return c;
				}
			}

			if (left.length > right.length) return false;
			if (left.length < right.length) return true;
			return undefined;
		} else if (typeof left === "number" && typeof right === "number") {
			if (left > right) return false;
			if (left < right) return true;
			return undefined;
		} else {
			return compare(convertTypes(left), convertTypes(right));
		}
	}
	const rightOrderIndices = [];
	let index = 0;

	for (const [a, b] of parsed) {
		index++;
		if (compare(a as Node, b as Node)) {
			rightOrderIndices.push(index);
		}
	}
	console.log("Right order indices: ", rightOrderIndices);
	console.log(
		"Sum of right order indices: ",
		rightOrderIndices.reduce((a, b) => a + b, 0)
	);
};
