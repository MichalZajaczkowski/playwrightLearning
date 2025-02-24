import {FrameLocator, Locator, expect, Page} from '@playwright/test';

export async function resizeElement(locator: Locator | FrameLocator, selector: string, width: string, height: string) {
    // Resize the outer container
    await locator.locator(selector).evaluate((element: HTMLElement, { width, height }) => {
        element.style.width = width;
        element.style.height = height;
    }, { width, height }); // Przekazujemy width i height jako argument
}

export async function resizeElementByDrag(page: Page, locator: Locator | FrameLocator, resizerSelector: string, deltaX: number, deltaY: number) {
    const resizerHandle = locator.locator(resizerSelector);
    const boundingBox = await resizerHandle.boundingBox();

    // Przesunięcie względem boundingBox
    const targetX = boundingBox.x + deltaX + boundingBox.width / 2;
    const targetY = boundingBox.y + deltaY + boundingBox.height / 2;

    await resizerHandle.hover();
    await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2); // Przesuń kursor na środek elementu
    await page.mouse.down(); // Wciśnij przycisk myszy
    await page.mouse.move(targetX, targetY); // Przesuń mysz do celu
    await page.mouse.up();   // Puść przycisk myszy
}

export async function verifyElementSize(locator: Locator | FrameLocator, selector: string, expectedWidth: number, expectedHeight: number) {
    //verify the size of the container
    const element = locator.locator(selector);
    const elementSize = await element.boundingBox();
    expect(elementSize?.width).toBe(expectedWidth);
    expect(elementSize?.height).toBe(expectedHeight);
}
