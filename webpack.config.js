const publicPath = '/public';

const PATHS = {
  app: __dirname + '/app/app.js',
  build: __dirname + publicPath
};

module.exports = {
  entry: PATHS.app,
  output: {
    path: PATHS.build,
    publicPath: publicPath,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      }

    ]
  },
  resolve: {
    root: __dirname + '/app'
  }
}
