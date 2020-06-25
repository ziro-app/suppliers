const HtmlWebpackPlugin = require('html-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const webpack = require('webpack')

module.exports = (env, { mode }) => {
    const config = {
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                            plugins: ['@babel/plugin-transform-runtime']
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'raw-loader']
                }
            ]
        },
        plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })]
    }
    if (mode === 'development') {
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
            sheet_id_charge,
            seller_id_ziro,
            sheet_cnpj_id,
            api_email,
            sheet_collaborators_id
        } = require('./credentials')
        config.devtool = 'cheap-module-eval-source-map'
        config.devServer = { historyApiFallback: true }
        config.plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
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
                    SHEET_ID_CHARGE: JSON.stringify(sheet_id_charge),
                    SELLER_ID_ZIRO: JSON.stringify(seller_id_ziro),
                    SHEET_CNPJ_ID: JSON.stringify(sheet_cnpj_id),
                    API_EMAIL: JSON.stringify(api_email),
                    SHEET_COLLABORATORS_ID: JSON.stringify(sheet_collaborators_id)
                }
            })
        )
    }
    if (mode === 'production') {
        config.devtool = 'cheap-module-source-map'
        config.plugins.push(
            new CompressionPlugin(),
            new CopyWebpackPlugin([
                { from: './_redirects', to: '_redirects', toType: 'file' },
                { from: './src/sw.js', to: 'sw.js', toType: 'file' }
            ]),
            new WebpackPwaManifest({
                name: 'Fabricantes',
                short_name: 'Fabricantes',
                start_url: '/',
                background_color: '#FFF',
                theme_color: '#FFF',
                display: 'standalone',
                icons: [{ src: './logo.png', sizes: [96, 128, 192, 256, 384, 512] }]
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    SHEET_URL: JSON.stringify(process.env.SHEET_URL),
                    SHEET_TOKEN: JSON.stringify(process.env.SHEET_TOKEN),
                    SHEET_ID: JSON.stringify(process.env.SHEET_ID),
                    CONTINUE_URL: JSON.stringify(process.env.CONTINUE_URL),
                    CNPJ_URL: JSON.stringify(process.env.CNPJ_URL),
                    CNPJ_TOKEN: JSON.stringify(process.env.CNPJ_TOKEN),
                    SHEET_SUPPLIERS_ID: JSON.stringify(process.env.SHEET_SUPPLIERS_ID),
                    PAY_URL: JSON.stringify(process.env.PAY_URL),
                    PAY_TOKEN: JSON.stringify(process.env.PAY_TOKEN),
                    ZOOP_AUTH: JSON.stringify(process.env.ZOOP_AUTH),
                    DOC_URL: JSON.stringify(process.env.DOC_URL),
                    SHEET_ID_CHARGE: JSON.stringify(process.env.SHEET_ID_CHARGE),
                    SELLER_ID_ZIRO: JSON.stringify(process.env.SELLER_ID_ZIRO),
                    SHEET_CNPJ_ID: JSON.stringify(process.env.SHEET_CNPJ_ID),
                    API_EMAIL: JSON.stringify(process.env.API_EMAIL),
                    SHEET_COLLABORATORS_ID: JSON.stringify(process.env.SHEET_COLLABORATORS_ID)
                }
            })
        )
    }
    return config
}
