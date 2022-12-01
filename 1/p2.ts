import { join } from "path";
import { readFile } from "fs/promises";
function chunkArray(array: Array<any>) {
	const tempArray: any[][] = [];
	let arraySection = [];
	for (let index = 0; index < array.length; index++) {
		if (array[index].length > 0) {
			arraySection.push(array[index]);
		} else {
			tempArray.push(arraySection);
			arraySection = [];
		}
		if (index === array.length - 1) {
			tempArray.push(arraySection);
		}
	}
	return tempArray;
}
(async () => {
	const elfCalorieLog = await readFile(join(__dirname + "/1", "input.txt"), "utf8");
	const elfCalorieLogSplit = elfCalorieLog.split("\n");
	console.log(elfCalorieLogSplit.length, elfCalorieLogSplit.length - elfCalorieLogSplit.filter((e) => e.length === 0).length);
	const elfGroups = chunkArray(elfCalorieLog.split("\n"));
	console.log(elfGroups.map((group) => group.length).reduce((a, b) => a + b, 0));
	console.log(elfGroups);
	const elfGroupTotals = elfGroups.map((group) => group.reduce((a, b) => Number(a) + Number(b), 0)).sort((a, b) => b - a);
	console.log(elfGroupTotals);
	const topThreeElves = elfGroupTotals.slice(0, 3)
	console.log(topThreeElves)
	const topThreeTotal = topThreeElves.reduce((a, b) => a + b, 0);
	console.log(topThreeTotal);
})();
