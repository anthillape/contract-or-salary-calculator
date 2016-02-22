module.exports = {
	'env': {
		'browser': true,
		'es6': true
	},
	'plugins': [
    'babel'
  ],
	'parser': 'babel-eslint',
	'extends': 'eslint:recommended',
	'parserOptions': {
		'sourceType': 'module'
	},
	'ecmaFeatures': { modules: true },
	'globals': {
		module: true,
		__dirname: true
	},
	'rules': {
		'babel/object-shorthand': 1,
		'strict': 0,
		'no-unused-vars': 1,
		'no-console': 1,
		'indent': [
			2,
			'tab'
		],
		'linebreak-style': [
			2,
			'unix'
		],
		'quotes': [
			2,
			'single'
		],
		'semi': [
			2,
			'always'
		]
	}
};
