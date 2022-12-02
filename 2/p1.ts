import { join } from "path";
import { readFile } from "fs/promises";

(async () => {
	const input = await readFile(join(__dirname + "/2", "input.txt"), "utf-8");
	const games = input.split("\n");

	console.log(games);
	const gamesPlayerInputs = games.map((game) => game.split(" "));
	const gameScores = gamesPlayerInputs.map(([playerOne, playerTwo]) => {
		if (playerOne === "A" && playerTwo === "X") return 4;
		if (playerOne === "B" && playerTwo === "Y") return 5;
		if (playerOne === "C" && playerTwo === "Z") return 6;
		if (playerOne === "A" && playerTwo === "Y") return 8;
		if (playerOne === "B" && playerTwo === "Z") return 9;
		if (playerOne === "C" && playerTwo === "X") return 7;
		if (playerOne === "A" && playerTwo === "Z") return 3;
		if (playerOne === "B" && playerTwo === "X") return 1;
		if (playerOne === "C" && playerTwo === "Y") return 2;
	});
	console.log(gameScores.length);
	const totalScore = gameScores.reduce((acc, score) => acc + score, 0);
	console.log("Total score:", totalScore);
})();
