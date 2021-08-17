const path = require("path");
const join = (...args) => path.join(__dirname, ...args);
const { getVoyoParams } = require("@voyo/run-command");
const nodeEnv = process.env.NODE_ENV;
const isDev = nodeEnv === "development";


const platform="h5";

const sassOpts = {
  sourceMap: false,
  implementation: require("sass"),
  additionalData: `
   $--voyo-platform:${platform};
   $--voyo-platform-h5:${platform === "h5"};
`
};

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    plugins: [],
    externals: {
      "@voyo-global": JSON.stringify(data)
    }
  },

  chainWebpack: config => {
    /**
     * 更改其他scss rule
     */
    config.module
      .rule("scss")
      .oneOf("vue")
      .use("sass-loader")
      .options(sassOpts);

    config.module
      .rule("scss")
      .oneOf("normal")
      .use("sass-loader")
      .options(sassOpts);
    config.module
      .rule("scss")
      .oneOf("normal-modules")
      .use("sass-loader")
      .options(sassOpts);
    config.module
      .rule("scss")
      .oneOf("vue-modules")
      .use("sass-loader")
      .options(sassOpts);
    
    config.optimization.sideEffects = true;
  }
};
