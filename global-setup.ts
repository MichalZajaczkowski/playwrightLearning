import fs from "fs";
import path from "path";

const RESULTS_DIR = "allure-results";
const REPORT_DIR = "allure-report";

class ReportManager {
  private readonly allureResultsDir: string;
  private readonly allureReportDir: string;

  constructor() {
    this.allureResultsDir = path.join(process.cwd(), RESULTS_DIR);
    this.allureReportDir = path.join(process.cwd(), REPORT_DIR);
  }

  private ensureDirectoryExists(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private preserveHistory(): void {
    const historyDir = path.join(this.allureResultsDir, 'history');
    const reportHistoryDir = path.join(this.allureReportDir, 'history');

    this.ensureDirectoryExists(this.allureResultsDir);

    // Jeśli istnieje historia w raporcie, skopiuj ją do wyników
    if (fs.existsSync(reportHistoryDir)) {
      this.ensureDirectoryExists(historyDir);
      fs.cpSync(reportHistoryDir, historyDir, { recursive: true });
    }
  }

  public prepareReportDirectory(): void {
    // Zachowaj historię przed wyczyszczeniem
    this.preserveHistory();

    // Wyczyść folder wyników, zachowując historię
    fs.readdirSync(this.allureResultsDir).forEach(file => {
      const filePath = path.join(this.allureResultsDir, file);
      if (file !== 'history' && fs.existsSync(filePath)) {
        fs.rmSync(filePath, { recursive: true, force: true });
      }
    });
  }
}

const globalSetup = async (): Promise<void> => {
  const reportManager = new ReportManager();
  reportManager.prepareReportDirectory();
};

export default globalSetup;
