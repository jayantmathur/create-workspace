import ThemeProvider from "@/providers/next-theme";
// import R3FProvider from "@/providers/r3f";

const Providers = ({ children }: { children: React.ReactNode }) => (
  // <R3FProvider>
  <ThemeProvider>{children}</ThemeProvider>
  // </R3FProvider>
);

export default Providers;
