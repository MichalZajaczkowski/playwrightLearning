import { Page, Locator } from "@playwright/test";

export class GlobalsQaPage {
    private page: Page;
    private tabsButton: Locator;
    private reSizeAccordionButton: Locator;
    private toggleAccordionButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // Zamiast samego href, używamy dopasowania po klasie i tekscie "Tabs"
        // M.in. "a.button:has-text('Tabs')" szuka linku <a class="button ...>Tabs</a>
        // a dookreślamy go, że ma być wewnątrz .price_column
        this.tabsButton = this.page.locator("div.price_column a.button", { hasText: 'Tabs' });
        this.reSizeAccordionButton = this.page.locator('[id="Re-Size Accordion"]');
        this.toggleAccordionButton = this.page.locator('[id="Toggle Icons"]');
    }

    async openHomePage(): Promise<void> {
        await this.page.goto("https://www.globalsqa.com/demo-site/");
    }

    async openAccordionAndTabsPage(): Promise<void> {
        await this.page.goto("https://www.globalsqa.com/demo-site/accordion-and-tabs/");
    }

    async clickTabsButton(): Promise<void> {
        await this.tabsButton.click();
    }

    async isTabsButtonVisible(): Promise<boolean> {
        return await this.tabsButton.isVisible();
    }

    async reSizeAccordionClick(): Promise<void> {
        await this.reSizeAccordionButton.click();
    }

    async toggleAccordionClick(): Promise<void> {
        await this.toggleAccordionButton.click();
    }
}
