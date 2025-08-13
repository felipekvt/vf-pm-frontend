/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0F172A",
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#374151",
          700: "#1F2937",
          800: "#111827",
          900: "#0F172A",
        },
        accent: { DEFAULT: "#2563EB", hover: "#1D4ED8" },
        success: "#10B981",
        warn: "#F59E0B",
        danger: "#EF4444",
      },
      borderRadius: { xl: "14px", "2xl": "18px" },
      boxShadow: {
        card: "0 8px 30px rgba(2,6,23,0.08)",
      },
    },
  },
  plugins: [],
};
