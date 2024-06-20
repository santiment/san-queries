import tailwindConfig from 'san-webkit-next/tailwind.config.js'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [tailwindConfig],
  content: [...tailwindConfig.content, './node_modules/san-webkit-next/dist/**/*.{js,svelte}'],
}
