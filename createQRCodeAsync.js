import fs from "fs";
import QRCode from "qrcode";
import cluster from "node:cluster";
import http from "node:http";
import { cpus } from "node:os";
import process from "node:process";

const start = Date.now();

const numCPUs = cpus().length;

if (cluster.isPrimary) {
	console.log(`Number of CPUs is ${numCPUs}`);
	console.log(`Primary ${process.pid} is running`);

	// Fork workers.
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on("exit", (worker, code, signal) => {
		console.log(`worker ${worker.process.pid} died`);
		console.log("Let's fork another worker!");
		cluster.fork();
	});
} else {
	console.log(`Worker ${process.pid} started`);

	const users = JSON.parse(fs.readFileSync("users.json").toString());

	async function createQRCode(users) {
		await users.forEach((user) => {
			QRCode.toFile(`./qrcode-images/${user.id}.png`, user.cpf);
		});
	}

	createQRCode(users);
}

const end = Date.now();
console.log(`Execution time: ${end - start} ms OR  ${(end - start) / 1000} s`);
