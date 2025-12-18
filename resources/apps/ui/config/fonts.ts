import { Red_Hat_Display, Red_Hat_Mono, Urbanist } from "next/font/google";

export const rhd = Red_Hat_Display({
  subsets: ["latin"],
  variable: "--rhd",
  display: "swap",
});

export const rhm = Red_Hat_Mono({
  subsets: ["latin"],
  variable: "--rhm",
  display: "swap",
});

export const urb = Urbanist({
  subsets: ["latin"],
  variable: "--urb",
  display: "swap",
});
