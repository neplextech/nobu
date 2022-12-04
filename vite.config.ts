import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const srcPath = path.resolve(__dirname, "src", "renderer");

export default defineConfig({
    server: {
        open: false,
        port: 3000
    },
    root: `${__dirname}/src/renderer`,
    publicDir: `${__dirname}/public`,
    build: {
        outDir: `${__dirname}/dist`,
        emptyOutDir: true
    },
    resolve: {
        alias: [
            {
                find: "@ui/",
                replacement: srcPath
            }
        ]
    },
    plugins: [react()]
});
