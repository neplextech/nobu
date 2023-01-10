/* eslint-disable */

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/renderer/**/*.{html,js,ts,jsx,tsx}"],
    darkMode: "media",
    theme: {
        extend: {
            colors: {
                xdark: "#1a1919",
                "xdark-0": "#3b3a3a",
                "xdark-1": "#242424",
                xlight: "#EBEBEB",
                "xlight-0": "#F8F8F8",
                "xlight-1": "#F6F6F6"
            }
        }
    },
    plugins: [require("@tailwindcss/forms")]
};
