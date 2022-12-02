import { join } from "path";
import { readFile } from "fs/promises";

(async () => {
	const elfCalorieLog = await readFile(join(__dirname, "input.txt"), "utf8");
	const elfCalorieLogSplit = elfCalorieLog.split("\n\n");

	const elfGroups = elfCalorieLogSplit.map((e) => e.split("\n"));
	console.log(elfGroups.map((group) => group.length).reduce((a, b) => a + b, 0));
	console.log(elfGroups);
	const elfGroupTotals = elfGroups.map((group) => group.reduce((a, b) => Number(a) + Number(b), 0)).sort((a, b) => b - a);
	console.log(elfGroupTotals);
	const topThreeElves = elfGroupTotals.slice(0, 3);
	console.log(topThreeElves);
	const topThreeTotal = topThreeElves.reduce((a, b) => a + b, 0);
	console.log(topThreeTotal);
})();
