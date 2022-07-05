import fs from "fs";

let listaCPF = [];
let cpfNumber = "";

for (let i = 1; i <= 5000; i++) {
	for (let j = 1; j <= 11; j++) {
		let number = (Math.floor(Math.random() * 9) + 1).toString();
		cpfNumber += number;
	}
	listaCPF.push({ id: i, cpf: cpfNumber });
	cpfNumber = "";
}
fs.writeFileSync("./users.json", JSON.stringify(listaCPF));
