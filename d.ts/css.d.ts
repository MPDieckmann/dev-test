/// <reference types="requirejs" />
export declare function load(name: string, req: Require, onload: {
    (): void;
    error(): void;
    fromText(text: string, textAlt: string): void;
}, config: RequireConfig): void;
