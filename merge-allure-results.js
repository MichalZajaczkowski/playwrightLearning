const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const allureResultsDir = path.join(process.cwd(), "allure-results");
const mergedDir = path.join(process.cwd(), "merged-allure-results");

// Usunięcie istniejącego folderu scalonego, jeśli istnieje
if (fs.existsSync(mergedDir)) {
  fs.rmSync(mergedDir, { recursive: true, force: true });
}
fs.mkdirSync(mergedDir, { recursive: true });

// Pobranie listy podkatalogów (każdy raport)
const reportDirs = fs
  .readdirSync(allureResultsDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => path.join(allureResultsDir, dirent.name));

reportDirs.forEach((dir) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const sourcePath = path.join(dir, file);
    const targetPath = path.join(mergedDir, file);
    // Kopiowanie pliku – jeżeli plik o tej samej nazwie już istnieje, można dodać prefiks
    fs.copyFileSync(sourcePath, targetPath);
  });
});

console.log(`Wyniki scalone do katalogu: ${mergedDir}`);

// Generowanie raportu Allure na podstawie scalonych wyników
execSync(`allure generate ${mergedDir} --clean -o allure-report`, {
  stdio: "inherit",
});
// Otwarcie raportu Allure
execSync(`allure open allure-report`, { stdio: "inherit" });
