export default async (input: string) => {
	const elfCalorieLog = input;
	const elfCalorieLogSplit = elfCalorieLog.split("\n\n");

	const elfGroups = elfCalorieLogSplit.map((e) => e.split("\n"));
	console.log(elfGroups);
	console.log(elfGroups.map((group) => group.length).reduce((a, b) => Number(a) + Number(b), 0));

	const elfGroupTotals = elfGroups.map((group) => group.reduce((a, b) => Number(a) + Number(b), 0)).sort((a, b) => b - a);
	console.log(elfGroupTotals);
	const highestCalorieElf = elfGroupTotals[0];
	console.log(highestCalorieElf);
};
