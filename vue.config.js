module.exports = {
  transpileDependencies: [
    "vuetify",
    "vuex-persist",
  ],
  devServer: {
    proxy: "http://localhost:9000",
  },
};
