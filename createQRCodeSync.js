import fs from "fs";
import QRCode from "qrcode";

const start = Date.now();

// Lê a lista de usuários
const users = JSON.parse(fs.readFileSync("users.json").toString());

const createQRCode = async (users) => {
	await users.forEach(async (user) => {
		// Gera e salva o QRCode como imagem
		await QRCode.toFile(`./qrcode-images/${user.id}.png`, user.cpf)
			.then(() => {
				console.log(`salvou a imagem ${user.id}.png`);
			})
			.finally(() => {
				// Calcula o tempo de execução
				const end = Date.now();
				console.log(
					`Tempo de Execução: ${end - start} ms |  ${(end - start) / 1000} s`
				);
			});
	});
};

createQRCode(users);
