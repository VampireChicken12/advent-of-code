import { join } from "path";
import { readFile } from "fs/promises";

(async function () {
	const input = await readFile(join(__dirname, "input_prod.txt"), "utf-8");
	for (let i = 3; i < input.length; i += 1) {
		let cache = {};
		const section = input.slice(i, i + 14);
		const chars = section.split("");
		chars.forEach((val) => {
			if (!cache[val]) cache[val] = 1;
			else cache[val]++;
		}, {});
		if (Object.values(cache).filter((e) => e > 1).length > 0) {
			continue;
		} else {
			console.log(section, i);
			console.log(section.length + i);
			break;
		}
	}
})();
