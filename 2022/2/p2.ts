type playerOneRPS = "A" | "B" | "C";
type playerTwoRPS = "X" | "Y" | "Z";
export default async (input: string) => {
	const games = input.split("\n");

	const playerOneValues = ["A", "B", "C"];
	console.log(games);
	const gamesPlayerInputs = games.map((game) => game.split(" "));
	console.log(gamesPlayerInputs.length);
	const gameScores = gamesPlayerInputs.map(([playerOne, playerTwo]: [playerOneRPS, playerTwoRPS]) => {
		let roundScore = 0;
		if (playerTwo === "X") roundScore += 0;
		if (playerTwo === "Y") roundScore += 3;
		if (playerTwo === "Z") roundScore += 6;

		let playerOneOffset = playerOneValues.findIndex((value) => value === playerOne)! + 1;

		if (playerTwo === "X") playerOneOffset -= 1;
		if (playerTwo === "Z") playerOneOffset += 1;
		playerOneOffset = playerOneOffset % 3;
		roundScore += playerOneOffset;
		if (playerOneOffset === 0) {
			roundScore += 3;
		}

		return roundScore;
	});
	const totalScore = gameScores.reduce((acc, score) => acc + score, 0);
	console.log("Total score:", totalScore);
};
