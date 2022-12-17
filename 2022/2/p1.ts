import parseLines from "../../utils/parseLines";
type playerOneRPS = "A" | "B" | "C";
type playerTwoRPS = "X" | "Y" | "Z";
export default async (input: string) => {
	const games = parseLines(input);

	console.log(games);
	const gamesPlayerInputs = games.map((game) => game.split(" "));
	const gameScores = gamesPlayerInputs.map(([playerOne, playerTwo]: [playerOneRPS, playerTwoRPS]) => {
		if (playerOne === "A") {
			if (playerTwo === "X") return 4;
			if (playerTwo === "Y") return 8;
			if (playerTwo === "Z") return 3;
		}
		if (playerOne === "B") {
			if (playerTwo === "X") return 1;
			if (playerTwo === "Y") return 5;
			if (playerTwo === "Z") return 9;
		}
		if (playerOne === "C") {
			if (playerTwo === "X") return 7;
			if (playerTwo === "Y") return 2;
			if (playerTwo === "Z") return 6;
		}
	});
	console.log(gameScores.length);
	const totalScore = gameScores.reduce((acc, score) => acc + score, 0);
	console.log("Total score:", totalScore);
};
