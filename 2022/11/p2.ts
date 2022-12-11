import { join } from "path";
import { readFile } from "fs/promises";

(async function () {
	// const input = await readFile(join(__dirname, "input_test.txt"), "utf-8");
	const input = await readFile(join(__dirname, "input_prod.txt"), "utf-8");
	const split = input.split("\n\n");
	const monkeys = split.map((i) => {
		const [monkey, startingItems, operation, test, t, f] = i.split("\n").map((l) => l.trim());
		return {
			id: parseInt(monkey.match(/\d/)[0]),
			items: startingItems
				.split(":")[1]
				.trim()
				.split(",")
				.map((i) => parseInt(i, 10)),
			divisor: parseInt(test.split(":")[1].trim().replace("divisible by", "")),
			operation: (worry: number) => {
				const [op, amount] = operation.split(":")[1].trim().replace("new = old ", "").split(" ");
				const parsedAmount = amount === "old" ? worry : parseInt(amount);
				if (op === "+") return worry + parsedAmount;
				if (op === "*") return worry * parsedAmount;
				throw new Error("invalid operation");
			},
			condition: (worry: number) => {
				const trueMonkey = parseInt(t.split(":")[1].trim().match(/\d/)[0]);
				const falseMonkey = parseInt(f.split(":")[1].trim().match(/\d/)[0]);
				const divisor = parseInt(test.split(":")[1].trim().replace("divisible by", ""));
				if (worry % divisor === 0) return trueMonkey;
				return falseMonkey;
			}
		};
	});
	const monkeyModulus = monkeys.reduce((a, b) => a * b.divisor, 1);
	let rounds = 0;
	const monkeyCounts = new Array(monkeys.length).fill(0);
	while (rounds < 10000) {
		rounds++;
		for (const monkey of monkeys) {
			while (monkey.items.length > 0) {
				monkeyCounts[monkey.id]++;
				const worry = monkey.items.shift();
				const newWorry = monkey.operation(worry) % monkeyModulus;
				const nextMonkey = monkey.condition(newWorry);
				monkeys[nextMonkey].items.push(newWorry);
			}
		}
	}
	console.log(monkeyCounts);
	const sortedMonkeys = monkeyCounts.sort((a, b) => b - a);
	console.log(sortedMonkeys[0] * sortedMonkeys[1]);
})();
