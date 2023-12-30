/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                header: ["Alpino"],
                "header-two": ["Zodiak"],
            },
            keyframes: {
                roll: {
                    "0%": {
                        transform: "translateX(-1px)",
                    },
                    "100%": {
                        transform: "translateX(-60px)",
                    },
                },
            },
            animation: {
                rolling: "roll 3s linear infinite",
            },
        },
    },
    plugins: [],
};
