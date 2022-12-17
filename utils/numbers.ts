export function range(num1: number, num2: number): number[] {
	return Array.from({ length: num2 - num1 }, (_, i) => num1 + i);
}

export function inclusiveRange(num1: number, num2: number): number[] {
	return Array.from({ length: num2 - num1 + 1 }, (_, i) => num1 + i);
}

export const rangesOverlap = ([[l1, h1], [l2, h2]]: number[][]): boolean => !(l1 > h2 || l2 > h1);
