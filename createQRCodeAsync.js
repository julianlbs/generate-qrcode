import fs from "fs";
import QRCode from "qrcode";
import cluster from "node:cluster";
import http from "node:http";
import { cpus } from "node:os";
import process from "node:process";

const start = Date.now();

// Quantidade de threads criadas
const numCPUs = 8;

// Lê lista de usuários
const users = JSON.parse(fs.readFileSync("users.json").toString());

const saveImages = async () => {
	async function createQRCode(users) {
		// Distribui os processos entre as threads
		const clusterUsers = users.filter(
			(_, index) => index % numCPUs === cluster.worker.id - 1
		);

		for (const user of clusterUsers) {
			// Gera e salva os QRCode em imagens
			await QRCode.toFile(`./qrcode-images/${user.id}.png`, user.cpf).then(
				() => {
					console.log(`${cluster.worker.id} salvou a imagem ${user.id}.png`);
				}
			);
		}

		// Calcula o tempo de execução
		const end = Date.now();
		console.log(
			`Tempo de Execução: ${end - start} ms |  ${(end - start) / 1000} s`
		);
	}

	if (cluster.isPrimary) {
		console.log(`Number of CPUs is ${numCPUs}`);
		console.log(`Primary ${process.pid} is running`);

		// Cria threads (workers).
		for (let i = 0; i < numCPUs; i++) {
			cluster.fork();
		}
	} else {
		// Código executado por cada thread
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
