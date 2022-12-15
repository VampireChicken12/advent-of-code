import { readFile } from "fs/promises";
import inquirer from "inquirer";
import { join } from "path";

const getInput = async (year: string, day: string, type: "prod" | "test") => {
	const path = join("..", `/${year}/${day}/input_${type}.txt`);
	const input = await readFile(path, "utf-8");
	return input;
};

const runAnswer = async () => {
	const answers = await inquirer.prompt([
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
	const yearFolder = `${answers.year}`;
	const dayFolder = `${answers.day}`;

	const input = await getInput(answers.year, answers.day, answers.inputType);
	const func = (await import(`../../${yearFolder}/${dayFolder}/p${answers.part}.ts`)).default;

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
};
(async () => {
	runAnswer();
})();
