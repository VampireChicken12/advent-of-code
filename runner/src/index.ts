import { readFile } from "fs/promises";
import { Command, Option } from "commander";
import inquirer from "inquirer";
import { join } from "path";
const program = new Command();
// Use Commander to parse the year, day, part and input parameters
program
	.addOption(new Option("-y, --year <year>", "Year of the puzzle you want to run").default(new Date().getFullYear().toString(), "current year"))
	.addOption(new Option("-d, --day <day>", "Day of the puzzle you want to run").default(new Date().getDate().toString(), "current day"))
	.addOption(new Option("-p, --part <part>", "Part of the puzzle you want to run").choices(["1", "2"]))
	.addOption(new Option("-i, --input <input>", "Input type for the puzzle you want to run").choices(["test", "prod"]))
	.parse();

const { year, day, part, input } = program.opts();

const getInput = async (year: string, day: string, type: "prod" | "test") => {
	const path = join("..", `/${year}/${day}/input_${type}.txt`);
	const input = await readFile(path, "utf-8");
	return input;
};

const runAnswer = async (year?: string, day?: string, inputType?: "prod" | "test", part?: "p1" | "p2") => {
	if (year && day && inputType && part) {
		const input = await getInput(year, day, inputType);
		const func = (await import(`../../${year}/${day}/p${part}.ts`)).default;

		await func(input);

		const runAgainAnswer = await inquirer.prompt([
			{
				type: "list",
				name: "runAgain",
				message: "Would you like to run another?",
				choices: ["yes", "no"]
			}
		]);

		if (runAgainAnswer.runAgain === "yes") {
			await runAnswer();
		}
	} else {
		const { year, day, inputType, part } = await inquirer.prompt([
			{
				type: "text",
				name: "year",
				message: "What year do you want to run?",
				default: new Date().getFullYear().toString()
			},
			{
				type: "text",
				name: "day",
				message: "Which day do you want to run?",
				default: new Date().getDate().toString()
			},
			{
				type: "list",
				name: "part",
				message: "Which part?",
				choices: ["1", "2"]
			},
			{
				type: "list",
				name: "inputType",
				message: "Which input?",
				choices: ["test", "prod"]
			}
		]);

		const input = await getInput(year, day, inputType);
		const func = (await import(`../../${year}/${day}/p${part}.ts`)).default;

		await func(input);

		const runAgainAnswer = await inquirer.prompt([
			{
				type: "list",
				name: "runAgain",
				message: "Would you like to run another?",
				choices: ["yes", "no"]
			}
		]);

		if (runAgainAnswer.runAgain === "yes") {
			await runAnswer();
		}
	}
};
(async () => {
	if (day && year && input && part) return runAnswer(year, day, input, part);
	runAnswer();
})();
