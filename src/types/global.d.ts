export {};

declare global {
    // CHQ: Gemini AI identified and corrected capitalization for Window
    interface Window {
        claude?: {
            use(name: "downloads"): Promise<
            {save(opts: {filename: string; data: Blob}): Promise<void>} | undefined
            >;
        };
    }
}