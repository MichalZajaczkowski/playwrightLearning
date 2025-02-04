import fs from "fs";
import path from "path";
import crypto from "crypto";

const MAX_REPORTS = 5; // Maksymalna liczba przechowywanych raportów
const allureResultsDir = path.join(process.cwd(), "allure-results");

// Generowanie unikalnej nazwy folderu w formacie: RRRR-MM-DD_GG-MM-SS-ID
function generateUniqueFolderName(): string {
  const now = new Date();
  // Formatowanie daty jako YYYY-MM-DD
  const datePart = now.toISOString().split("T")[0];
  // Pobranie czasu HH-MM-SS (bez milisekund i strefy czasowej)
  const timePart = now.toTimeString().split(" ")[0].replace(/:/g, "-");
  const uniqueId = crypto.randomBytes(4).toString("hex");
  return `${datePart}_${timePart}_${uniqueId}`;
}

// Usuwanie najstarszych raportów, jeśli liczba folderów przekracza MAX_REPORTS
function cleanOldReports(): void {
  if (!fs.existsSync(allureResultsDir)) {
    fs.mkdirSync(allureResultsDir, { recursive: true });
    return;
  }

  // Pobierz podfoldery (czyli raporty)
  const reportFolders = fs
    .readdirSync(allureResultsDir)
    .map((name) => ({
      name,
      fullPath: path.join(allureResultsDir, name),
    }))
    .filter((entry) => fs.lstatSync(entry.fullPath).isDirectory())
    // Sortowanie rosnąco – najstarszy folder na początku
    .map((entry) => ({
      name: entry.name,
      mtime: fs.statSync(entry.fullPath).mtime.getTime(),
    }))
    .sort((a, b) => a.mtime - b.mtime);

  // Usuń najstarsze foldery, jeśli liczba przekracza MAX_REPORTS - usuwamy tyle, by zostało tylko MAX_REPORTS folderów
  while (reportFolders.length >= MAX_REPORTS) {
    const oldest = reportFolders.shift();
    if (oldest) {
      const reportPath = path.join(allureResultsDir, oldest.name);
      fs.rmSync(reportPath, { recursive: true, force: true });
      console.log(`🗑 Usunięto stary katalog raportu: ${oldest.name}`);
    }
  }
}

// Przygotowanie nowego katalogu raportu oraz ustawienie zmiennej środowiskowej
function prepareNewReportFolder(): string {
  const folderName = generateUniqueFolderName();
  const newFolderPath = path.join(allureResultsDir, folderName);
  fs.mkdirSync(newFolderPath, { recursive: true });
  process.env.ALLURE_RESULTS_DIRECTORY = newFolderPath;
  console.log(`📁 Nowy raport będzie zapisany w: ${newFolderPath}`);
  return newFolderPath;
}

// Globalna funkcja wykonywana przed testami
const globalSetup = async (): Promise<void> => {
  cleanOldReports();
  const newReportFolder = prepareNewReportFolder();

  // Przenoszenie plików (np. porzuconych z poprzednich uruchomień) z katalogu allure-results
  // – pomijamy podfoldery (czyli już raporty)
  fs.readdirSync(allureResultsDir).forEach((item) => {
    const itemPath = path.join(allureResultsDir, item);
    if (fs.lstatSync(itemPath).isFile()) {
      fs.renameSync(itemPath, path.join(newReportFolder, item));
    }
  });
};

export default globalSetup;
