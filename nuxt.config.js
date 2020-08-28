import theme from "@nuxt/content-theme-docs";

export default theme({
  server: {
    port: 5000, // default: 3000
    host: "0.0.0.0", // default: localhost,
    timing: false,
  },
  target: "server",
  content: {
    dir: "content",
  },
});
