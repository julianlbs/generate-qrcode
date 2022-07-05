import fs from "fs";
import QRCode from "qrcode";

const start = Date.now();

const users = JSON.parse(fs.readFileSync("users.json").toString());

async function createQRCode(users) {
	await users.forEach((user) => {
		QRCode.toFile(`./qrcode-images/${user.id}.png`, user.cpf);
	});
}

createQRCode(users);

const end = Date.now();
console.log(`Execution time: ${end - start} ms |  ${(end - start) / 1000} s`);
