const cssnano = require("cssnano");

module.exports = {
	plugins: [
		require("postcss-nested"),
		require("postcss-import"),
		require("tailwindcss"),
		require("autoprefixer"),
		// cssnano({
		//   preset: 'default'
		// })
	],
};
