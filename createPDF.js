import { jsPDF } from "jspdf";
import fs from "fs";

fs.readdirSync("./pdf-files").forEach((image) => {
	const doc = new jsPDF();
});
