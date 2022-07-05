import fs from "fs";
import QRCode from "qrcode";
import cluster from "node:cluster";
import http from "node:http";
import { cpus } from "node:os";
import process from "node:process";

const start = Date.now();
const start2 = Date.now();

const numCPUs = 2;
const users = JSON.parse(fs.readFileSync("users.json").toString());

const saveImages = async () => {
	async function createQRCode(users) {
		const clusterUsers = users.filter(
			(_, index) => index % numCPUs === cluster.worker.id - 1
		);

		for (const user of clusterUsers) {
			await QRCode.toFile(`./qrcode-images/${user.id}.png`, user.cpf);
			console.log(`${cluster.worker.id} salvou a imagem ${user.id}.png`);
		}

		const end = Date.now();
		console.log(
			`Execution time: ${end - start} ms |  ${(end - start) / 1000} s`
		);
	}

	if (cluster.isPrimary) {
		console.log(`Number of CPUs is ${numCPUs}`);
		console.log(`Primary ${process.pid} is running`);

		// Fork workers.
		for (let i = 0; i < numCPUs; i++) {
			cluster.fork();
		}
	} else {
		console.log(`Worker ${cluster.worker.id} started`);

		await createQRCode(users)
			.then(() => process.exit(0))
			.catch((err) => {
				console.error(err);
				process.exit(1);
			});
	}
};

saveImages();
