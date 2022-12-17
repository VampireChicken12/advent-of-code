export default class Timer {
	private start: Date;
	private name: string;
	constructor(name: string) {
		this.start = new Date();
		this.name = name;
	}
	stop() {
		var end = new Date();
		var time = end.getTime() - this.start.getTime();
		console.info("Timer:", this.name, "finished in", time, "ms");
	}
}
