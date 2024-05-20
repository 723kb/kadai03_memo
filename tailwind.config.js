/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html', // index.html を含める
    './**/*.{html,js}', // プロジェクト内の他のHTMLおよびJSファイルを含める
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
