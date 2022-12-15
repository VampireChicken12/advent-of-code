const parseSectionRanges = (input: string[]): [[number, number], [number, number]][] =>
	input.map((line) => line.split(",").map((part) => part.split("-").map(Number) as [number, number]) as [[number, number], [number, number]]);
export default async (input: string) => {
	const assignments = input.split("\n");
	console.log(assignments.map((assignment) => assignment.split(",")));
	const assignmentGroups = parseSectionRanges(assignments);

	console.log(assignmentGroups);
	const overlaps = assignmentGroups.reduce((sum, [[a, b], [d, c]]) => {
		return sum + +((a <= d && b >= c) || (d <= a && c >= b));
	}, 0);
	console.log(overlaps);
};
