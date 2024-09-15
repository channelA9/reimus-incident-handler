import type { Config } from "tailwindcss";
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ["./{pages,layouts,components,src}/**/*.{html,js,jsx,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      'sans': ['"Inter"', ...defaultTheme.fontFamily.sans],
      'serif': ['"Baskervville SC"', ...defaultTheme.fontFamily.serif]
    },
    extend: {
      fontFamily: {
        pixel: ['"Pixelify Sans"']
      }
    },
  },
  plugins: [require('@tailwindcss/typography'),],
} satisfies Config;
