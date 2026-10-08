export {};

declare global {
    interface window {
        claude?: {
            use(name: "downloads"): Promise<
            {save(opts: {filename: string; data: Blob}): Promise<void>} | undefined
            >;
        };
    }
}