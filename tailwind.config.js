/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/renderer/**/*.{html,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                xdark: "#2b2b2b",
                "xdark-0": "#333333",
                "xdark-1": "#242424"
            }
        }
    },
    plugins: []
};
