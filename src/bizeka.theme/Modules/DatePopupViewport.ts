interface DatePopupInput extends HTMLInputElement {
    _flatpickr?: { close(): void };
}

function closeDatePopups(): void {
    if (document.documentElement.dataset.bizekaTheme !== "bizeka")
        return;
    document.querySelectorAll<DatePopupInput>("input.flatpickr-input").forEach(input =>
        input._flatpickr?.close());
}

export function watchDatePopupViewport(): void {
    // addEventListener deduplicates the same handler when the theme is reapplied.
    window.addEventListener("resize", closeDatePopups);
}

export function unwatchDatePopupViewport(): void {
    window.removeEventListener("resize", closeDatePopups);
}
