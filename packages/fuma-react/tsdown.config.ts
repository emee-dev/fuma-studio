import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: ["./src/**/*.{ts,tsx}"],
    platform: "neutral",
    dts: true,
  },
]);
