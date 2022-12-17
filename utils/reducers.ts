export const sum = (a: number, b: number) => a + b;
export const product = (a: number, b: number) => a * b;
export const max = (a: number, b: number) => Math.max(a, b);
export const min = (a: number, b: number) => Math.min(a, b);

export const chunks =
	<T>(chunkSize: number) =>
	(acc: T[][], next: T): T[][] =>
		acc[acc.length - 1].length === chunkSize ? [...acc, [next]] : [...acc.slice(0, acc.length - 1), [...acc[acc.length - 1], next]];

export const groupBy =
	<Item, Characteristic extends string | number>(characteristic: (t: Item) => Characteristic) =>
	(groups: Record<Characteristic, Item[]>, next: Item): Record<Characteristic, Item[]> => {
		const char = characteristic(next);
		if (char in groups) {
			groups[char].push(next);
		} else {
			groups[char] = [next];
		}
		return groups;
	};
