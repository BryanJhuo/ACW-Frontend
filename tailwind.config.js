/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'funnel-sans': [
                    '"Funnel Sans"',
                    'sans-serif'
                ]
            }
        }
    },
    plugins: [],
}
