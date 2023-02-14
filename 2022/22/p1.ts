import parseLines from "../../utils/parseLines";
export default async (input: string) => {
	const lines = parseLines(input);
	const map = input
		.split("\n")
		.slice(0, -1)
		.map((line) => line.split(""));
	const instructions = input.split("\n").slice(-1)[0].split("");
};
