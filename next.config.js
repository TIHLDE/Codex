const withMarkdoc = require("@markdoc/next.js");

module.exports = withMarkdoc(
  /* config: https://markdoc.io/docs/nextjs#options */ { mode: "static" },
)({
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdoc"],
  serverRuntimeConfig: {
    PROJECT_ROOT: "./",
  },
});
