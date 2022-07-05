import fs from "fs";

let listaUsuarios = []; // Salva a lista de usuários
let cpfNumber = "";

// Gera o banco de usuários
for (let i = 1; i <= 5000; i++) {
	for (let j = 1; j <= 11; j++) {
		let number = (Math.floor(Math.random() * 9) + 1).toString(); // Gera número aleatório entre 1 e 9
		cpfNumber += number;
	}
	listaUsuarios.push({ id: i, cpf: cpfNumber }); // Adiciona um usuário à lista
	cpfNumber = "";
}
fs.writeFileSync("./users.json", JSON.stringify(listaUsuarios)); // Salva a lista no arquivo users.json
