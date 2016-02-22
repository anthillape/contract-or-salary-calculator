const publicPath = '/public';

const PATHS = {
	app: __dirname + '/app/app.js',
	build: __dirname + publicPath
};

module.exports = {
	eslint: {
		configFile: __dirname + '/.eslintrc.js'
	},
	entry: PATHS.app,
	output: {
		path: PATHS.build,
		publicPath,
		filename: 'bundle.js',
		sourceMapFilename: '[file].map'
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
				loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
			},
			{
				test: /\.js$/,
				loader: 'eslint-loader',
				exclude: /node_modules/
			}

		]
	},
	resolve: {
		root: __dirname + '/app'
	}
};
