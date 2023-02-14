export default function parseLines(input: string, doubleNewline?: boolean): string[] {
	return input.split(doubleNewline ? "\n\n" : "\n").map((line) => line.trim());
}
