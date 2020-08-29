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
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/analytics-module
    [
      "@nuxtjs/google-analytics",
      {
        id: "UA-176712234-1",
      },
    ],
  ],
});
