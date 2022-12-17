import parseLines from "../../utils/parseLines";
const parseSectionRanges = (input: string[]): [[number, number], [number, number]][] =>
	input.map((line) => line.split(",").map((part) => part.split("-").map(Number) as [number, number]) as [[number, number], [number, number]]);
export default async (input: string) => {
	const assignments = parseLines(input);
	console.log(assignments.map((assignment) => assignment.split(",")));
	const assignmentGroups = parseSectionRanges(assignments);

	console.log(assignmentGroups);
	const overlaps = assignmentGroups.reduce((sum, [[a, b], [d, c]]) => {
		return sum + +((a <= d && b >= c) || (d <= a && c >= b));
	}, 0);
	console.log(overlaps);
	// Determine the amount of assignments that overlap at least once
	const overlappingAssignments = assignmentGroups.reduce((acc, [section1, section2]) => {
		const [section1Start, section1End] = section1;
		const [section2Start, section2End] = section2;
		if (section1Start <= section2End && section2Start <= section1End) {
			acc++;
		}
		return acc;
	}, 0);
	console.log(overlappingAssignments);
};
