export default function parseLines(input: string): string[] {
	return input.split("\n").map((line) => line.trim());
}
