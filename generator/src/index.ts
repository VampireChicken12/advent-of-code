import axios from "axios";
import { load } from "cheerio";
import { config } from "dotenv";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import inquirer from "inquirer";
import { join } from "path";

config();
(async () => {
	const questions = [
		{
			type: "text",
			name: "year",
			message: "What year do you want to generate?",
			default: new Date().getFullYear().toString()
		},
		{
			type: "text",
			name: "day",
			message: "What day do you want to generate?",
			default: new Date().getDate().toString()
		},
		{
			type: "confirm",
			name: "downloadDay",
			message: "Do you want to download the input for this day?",
			default: false
		}
	];
	// Get the current year and day from the inquirer prompt or use the current system date
	const { day, year, downloadDay } = await inquirer.prompt(questions);
	// Create the Advent of Code directory for the current year if it doesn't exist
	const yearDirectory = join("..", year);
	if (!existsSync(yearDirectory)) {
		mkdirSync(yearDirectory);
	}

	// Create the Advent of Code day directory for the current day
	const dayDir = join("..", year, day);
	if (!existsSync(dayDir)) {
		mkdirSync(dayDir);
	}

	// Create the p1.ts and p2.ts files
	const p1File = join(dayDir, "p1.ts");
	const p2File = join(dayDir, "p2.ts");
	const p1FileExists = existsSync(p1File);
	const p2FileExists = existsSync(p2File);
	const p1FileContents = p1FileExists ? readFileSync(p1File).toString().length : 0;
	const p2FileContents = p2FileExists ? readFileSync(p2File).toString().length : 0;
	// Write the default async function to the p1.ts and p2.ts files
	const asyncFn = `export default async (input: string) => {

}
`;
	// Only write the p1.ts and p2.ts files if they don't exist or exist but are empty
	if (p1FileContents === 0 || !existsSync(p1File)) writeFileSync(p1File, asyncFn);
	if (p2FileContents === 0 || !existsSync(p2File)) writeFileSync(p2File, asyncFn);
	// Create the input_test.txt and input_prod.txt files
	const inputTestFile = join(dayDir, "input_test.txt");
	const inputProdFile = join(dayDir, "input_prod.txt");
	if (downloadDay) {
		const cookie = process.env.ADVENT_OF_CODE_SESSION;

		const url = `https://adventofcode.com/${year}/day/${day}`;
		// Download the current days test input
		axios
			.get(url)
			.then((response) => {
				const dayPage = response.data as string;
				const $ = load(dayPage);
				const input = $("code").contents().first().text();
				if (input) {
					writeFileSync(inputTestFile, input);
				}
			})
			.catch((_) => {
				writeFileSync(inputTestFile, "");
			});

		if (cookie) {
			// Set the cookie header using your Advent of Code session cookie
			const headers = {
				Cookie: cookie
			};
			// Download the current day's prod input
			axios
				.get(`${url}/input`, { headers })
				.then((response) => {
					// Save the response to a file
					writeFileSync(inputProdFile, response.data.trim());
				})
				.catch((_) => {
					writeFileSync(inputProdFile, "");
				});
		} else {
			writeFileSync(inputProdFile, "");
		}
	} else {
		writeFileSync(inputTestFile, "");
		writeFileSync(inputProdFile, "");
	}
})();
