/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./src/app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        kanit: ["KanitRegular"],
        kanitBold: ["KanitBold"],
        kanitSemiBold: ["KanitSemiBold"],
        kanitExtraBold: ["KanitExtraBold"],
        kanitLight: ["KanitLight"],
        kanitMedium: ["KanitMedium"],
      },
      colors: {
        lightBlue: "#3db5e7",
        darkBlue: "#14284d",
        dirtyWhite: "#f5f5f5",
        saffron: "#fec62b",
      },
    },
  },
  plugins: [],
};
