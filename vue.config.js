'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Admin Template' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // dev port
let cdn = { css: [], js: [] }
let externals = {}

const isProd = process.env.NODE_ENV === 'production' // 表示当前环境是生产环境
if (isProd) {
  // 只有生产环境下 才做 排除打包 并且注入cdn文件
  cdn = {
    css: [
      // element-ui css
      // 'https://unpkg.com/element-ui/lib/theme-chalk/index.css' // 样式表
    ],
    js: [
      // vue must at first!
      'https://unpkg.com/vue/dist/vue.js', // vuejs
      // element-ui  js
      'https://cdn.staticfile.org/vue/2.5.10/vue.min.js', // elementUI
      'https://cdn.jsdelivr.net/npm/xlsx@0.16.6/dist/jszip.min.js',
      'https://cdn.jsdelivr.net/npm/xlsx@0.16.6/dist/xlsx.full.min.js'
    ]
  }

  externals = {
    // value为什么是全局变量  xlsx这个文件要用外链的方式引入
    // xlsx外链引入没办法 作为局部模块化的包名
    // key(要排除的打包的包的包名): value(要替代xlsx这个包的全局变量名称)
    // 全局变量名也不是随便定义的  这是外链文件中定义的名字 只不过我们现在提前知道了
    'vue': 'Vue',
    // 'element-ui': 'ELEMENT',
    'xlsx': 'XLSX'
  }
}

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // 代理选项
    // 可以有多个代理选项
    proxy: {
      // key表示如果一旦请求地址和它吻合 ，就会触发代理，代理的信息 在对象 value
      // localhost:8888/api/user  => http://ihrm-java.itheima.net/api/user  这是我们需要的地址
      // localhost:8888/api/user  => http://ihrm-java.itheima.net/user

      '/api': {
        target: 'http://ihrm-java.itheima.net/', // 要代理的目标地址
        // target: 'http://127.0.0.1:3000', // 要代理的目标地址
        changeOrigin: true // 是否跨域
        // localhost:8888/api/user => 触发代理 =>
        //  http://www.baidu.com/user  想要这种
        //  http://www.baidu.com/api/user  下面是目前的
        // pathRewrite: {
        //   '^/api': '' // 相当于将跨域代理之后的地址进行再次替换 就可以将 /api去掉
        // }
      }
    }
    // before: require('./mock/mock-server.js')
  },
  // vue.config.js是配置文件 它是基于webpack深度定制的配置文件  但是 有些内容不是特别一样
  // 配置webpack
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    // 排除打包的属性
    externals: externals
  },
  // 配置注入webpack的属性 这个属性会注入到模板的变量中
  chainWebpack(config) {
    // 插入cdn变量
    // args 就是原有注入模板中的变量
    config.plugin('html').tap(args => {
      // 注入点变量
      // args[0] 相当于 html模板中 htmlWebpackplugin.options
      args[0].cdn = cdn // 将cdn变量注入到html模板中
      return args
    })
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
