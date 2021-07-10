const HtmlWebpackPlugin = require("html-webpack-plugin")
const CompressionPlugin = require("compression-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const WebpackPwaManifest = require("webpack-pwa-manifest")
const webpack = require("webpack")
const path = require("path")

module.exports = (env, { mode }) => {
  const config = {
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
              plugins: ["@babel/plugin-transform-runtime"],
            },
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "raw-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      alias: {
        config: path.resolve("./config"),
        "@bit/ziro.firebase.account-management": path.resolve("./src/App/Componentsv2/firebase/accountManagement"),
        "@bit/ziro.firebase.catalog-user-data": path.resolve("./src/App/Componentsv2/firebase/catalogUserData"),
        "@bit/ziro.firebase.init": path.resolve("./src/App/Componentsv2/firebase/init"),
        "@bit/ziro.firebase.storeowner-data": path.resolve("./src/App/Componentsv2/firebase/storeownerData"),
        "@bit/ziro.firebase.user-status": path.resolve("./src/App/Componentsv2/firebase/userStatus"),
        "@bit/ziro.utils.component-state": path.resolve("./src/App/Componentsv2/utils/componentState"),
        "@bit/ziro.utils.context": path.resolve("./src/App/Componentsv2/utils/context"),
        "@bit/ziro.utils.device-detect": path.resolve("./src/App/Componentsv2/deviceDetect"),
        "@bit/ziro.utils.give-discount": path.resolve("./src/App/Componentsv2/utils/giveDiscount"),
        "@bit/ziro.utils.history": path.resolve("./src/App/Componentsv2/utils/history"),
        "@bit/ziro.utils.is-ellipsis-showing": path.resolve("./src/App/Componentsv2/isEllipsisShowing"),
        "@bit/ziro.utils.string-formatter": path.resolve("./src/App/Componentsv2/utils/stringFormatter"),
        "@bit/ziro.utils.strip-non-firebase-values": path.resolve(
          "./src/App/Componentsv2/utils/stripNonFirebaseValues",
        ),
        "@bit/ziro.utils.themes": path.resolve("./src/App/Componentsv2/utils/themes"),
        "@bit/ziro.utils.types": path.resolve("./src/App/Componentsv2/utils/types"),
        "@bit/ziro.utils.use-clipboard": path.resolve("./src/App/Componentsv2/utils/useClipboard"),
        "@bit/ziro.utils.use-device-size": path.resolve("./src/App/Componentsv2/utils/useDeviceSize"),
        "@bit/ziro.utils.use-http": path.resolve("./src/App/Componentsv2/utils/useHttp"),
        "@bit/ziro.utils.use-rollback": path.resolve("./src/App/Componentsv2/useRollback"),
        "@bit/ziro.utils.use-scroll-end": path.resolve("./src/App/Componentsv2/utils/useScrollEnd"),
        "@bit/ziro.utils.use-size": path.resolve("./src/App/Componentsv2/utils/useSize"),
        "@bit/ziro.unpublished.delete-and-submit-buttons": path.resolve(
          "./src/App/Componentsv2/unpublished/DeleteAndSubmitButtons",
        ),
        "@bit/ziro.utils.validate-cpf-cnpj": path.resolve("./src/App/Componentsv2/validateCpfCnpj"),
        "@bit/ziro.views.avatar": path.resolve("./src/App/Componentsv2/Avatar"),
        "@bit/ziro.views.badge": path.resolve("./src/App/Componentsv2/Badge"),
        "@bit/ziro.views.badge-wrapper": path.resolve("./src/App/Componentsv2/BadgeWrapper"),
        "@bit/ziro.views.button": path.resolve("./src/App/Componentsv2/Button"),
        "@bit/ziro.views.card": path.resolve("./src/App/Componentsv2/Card"),
        "@bit/ziro.views.conditional": path.resolve("./src/App/Componentsv2/Conditional"),
        "@bit/ziro.views.container": path.resolve("./src/App/Componentsv2/Container"),
        "@bit/ziro.views.divider": path.resolve("./src/App/Componentsv2/Divider"),
        "@bit/ziro.views.dots-loader": path.resolve("./src/App/Componentsv2/DotsLoader"),
        "@bit/ziro.views.error": path.resolve("./src/App/Componentsv2/Error"),
        "@bit/ziro.views.fixed-bar": path.resolve("./src/App/Componentsv2/FixedBar"),
        "@bit/ziro.views.form": path.resolve("./src/App/Componentsv2/Form"),
        "@bit/ziro.views.geo-map": path.resolve("./src/App/Componentsv2/GeoMap"),
        "@bit/ziro.views.header": path.resolve("./src/App/Componentsv2/Header"),
        "@bit/ziro.views.icon2": path.resolve("./src/App/Componentsv2/Icon2"),
        "@bit/ziro.views.icon-text": path.resolve("./src/App/Componentsv2/IconText"),
        "@bit/ziro.views.illustration": path.resolve("./src/App/Componentsv2/Illustration"),
        "@bit/ziro.views.information": path.resolve("./src/App/Componentsv2/Information"),
        "@bit/ziro.views.input": path.resolve("./src/App/Componentsv2/Input"),
        "@bit/ziro.views.link": path.resolve("./src/App/Componentsv2/Link"),
        "@bit/ziro.views.modal": path.resolve("./src/App/Componentsv2/Modal"),
        "@bit/ziro.views.product-gallery": path.resolve("./src/App/Componentsv2/ProductGallery"),
        "@bit/ziro.views.review-score": path.resolve("./src/App/Componentsv2/ReviewScore"),
        "@bit/ziro.views.router": path.resolve("./src/App/Componentsv2/Router"),
        "@bit/ziro.views.skeleton": path.resolve("./src/App/Componentsv2/Skeleton"),
        "@bit/ziro.views.slider": path.resolve("./src/App/Componentsv2/Slider"),
        "@bit/ziro.views.table": path.resolve("./src/App/Componentsv2/Table"),
        "@bit/ziro.views.tab-menu": path.resolve("./src/App/Componentsv2/TabMenu"),
        "@bit/ziro.views.text": path.resolve("./src/App/Componentsv2/Text"),
        "@bit/ziro.views.title": path.resolve("./src/App/Componentsv2/Title"),
      },
    },
    plugins: [new HtmlWebpackPlugin({ template: "./src/index.html" })],
  }
  if (mode === "development") {
    const {
      sheet_url,
      sheet_token,
      sheet_id,
      sheet_suppliers_id,
      continue_url,
      cnpj_url,
      cnpj_token,
      pay_url,
      pay_token,
      zoop_auth,
      doc_url,
      seller_id_ziro,
      sheet_id_transactions,
      sheet_cnpj_id,
      email_token,
      api_email,
      firebase_auth_url,
      firebase_auth_token,
      homolog,
      nextcode_email,
      nextcode_password,
      nextcode_auth,
      document_id_for_utilities_main,
    } = require("./credentials")
    config.devtool = "cheap-module-eval-source-map"
    config.devServer = { historyApiFallback: true, port: 7070 }
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env": {
          SHEET_ID_TRANSACTIONS: JSON.stringify(sheet_id_transactions),
          SHEET_URL: JSON.stringify(sheet_url),
          SHEET_TOKEN: JSON.stringify(sheet_token),
          SHEET_ID: JSON.stringify(sheet_id),
          CONTINUE_URL: JSON.stringify(continue_url),
          CNPJ_URL: JSON.stringify(cnpj_url),
          CNPJ_TOKEN: JSON.stringify(cnpj_token),
          SHEET_SUPPLIERS_ID: JSON.stringify(sheet_suppliers_id),
          PAY_URL: JSON.stringify(pay_url),
          PAY_TOKEN: JSON.stringify(pay_token),
          ZOOP_AUTH: JSON.stringify(zoop_auth),
          DOC_URL: JSON.stringify(doc_url),
          SELLER_ID_ZIRO: JSON.stringify(seller_id_ziro),
          SHEET_CNPJ_ID: JSON.stringify(sheet_cnpj_id),
          EMAIL_TOKEN: JSON.stringify(email_token),
          API_EMAIL: JSON.stringify(api_email),
          FIREBASE_AUTH_URL: JSON.stringify(firebase_auth_url),
          FIREBASE_AUTH_TOKEN: JSON.stringify(firebase_auth_token),
          DOCUMENT_ID_FOR_UTILITIES_MAIN: JSON.stringify(document_id_for_utilities_main),
          // FOR DEV TESTS ONLY
          HOMOLOG: JSON.stringify(homolog),
          NEXTCODE_EMAIL: JSON.stringify(nextcode_email),
          NEXTCODE_PASSWORD: JSON.stringify(nextcode_password),
          NEXTCODE_AUTH: JSON.stringify(nextcode_auth),
        },
      }),
    )
  }
  if (mode === "production") {
    config.devtool = "cheap-module-source-map"
    config.plugins.push(
      new CompressionPlugin(),
      new CopyWebpackPlugin([
        { from: "./_redirects", to: "_redirects", toType: "file" },
        { from: "./src/sw.js", to: "sw.js", toType: "file" },
      ]),
      new WebpackPwaManifest({
        name: "Fabricantes",
        short_name: "Fabricantes",
        start_url: "/",
        background_color: "#FFF",
        theme_color: "#FFF",
        display: "standalone",
        icons: [{ src: "./logo.png", sizes: [96, 128, 192, 256, 384, 512] }],
      }),
      new webpack.DefinePlugin({
        "process.env": {
          SHEET_URL: JSON.stringify(process.env.SHEET_URL),
          SHEET_TOKEN: JSON.stringify(process.env.SHEET_TOKEN),
          SHEET_ID: JSON.stringify(process.env.SHEET_ID),
          CONTINUE_URL: JSON.stringify(process.env.CONTINUE_URL),
          CNPJ_URL: JSON.stringify(process.env.CNPJ_URL),
          CNPJ_TOKEN: JSON.stringify(process.env.CNPJ_TOKEN),
          SHEET_SUPPLIERS_ID: JSON.stringify(process.env.SHEET_SUPPLIERS_ID),
          SHEET_ID_TRANSACTIONS: JSON.stringify(process.env.SHEET_ID_TRANSACTIONS),
          PAY_URL: JSON.stringify(process.env.PAY_URL),
          PAY_TOKEN: JSON.stringify(process.env.PAY_TOKEN),
          ZOOP_AUTH: JSON.stringify(process.env.ZOOP_AUTH),
          DOC_URL: JSON.stringify(process.env.DOC_URL),
          SELLER_ID_ZIRO: JSON.stringify(process.env.SELLER_ID_ZIRO),
          SHEET_CNPJ_ID: JSON.stringify(process.env.SHEET_CNPJ_ID),
          EMAIL_TOKEN: JSON.stringify(process.env.EMAIL_TOKEN),
          API_EMAIL: JSON.stringify(process.env.API_EMAIL),
          FIREBASE_AUTH_URL: JSON.stringify(process.env.FIREBASE_AUTH_URL),
          FIREBASE_AUTH_TOKEN: JSON.stringify(process.env.FIREBASE_AUTH_TOKEN),
          NEXTCODE_AUTH: JSON.stringify(process.env.NEXTCODE_AUTH),
          DOCUMENT_ID_FOR_UTILITIES_MAIN: JSON.stringify(process.env.DOCUMENT_ID_FOR_UTILITIES_MAIN),
        },
      }),
    )
  }
  return config
}
