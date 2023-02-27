import webpack from 'webpack';
import path from 'path';
import { WebpackBuildOptions } from './types';
import pluginsBuilder from './build/pluginsBuilder';
import loadersBuilder from './build/loadersBuilder';
import aliasesBuilder from './build/aliasesBuilder';
import extensionsBuilder from './build/extensionsBuilder';
import serverBuilder from './build/serverBuilder';

const createWebpackConfiguration = (options: WebpackBuildOptions): webpack.Configuration => {
	return {
		mode: options.mode,
		entry: path.join(options.paths.src, 'index.tsx'),
		output: {
			filename: options.isDev ? '[name].[contenthash].js' : '[name].js',
			path: options.paths.build,
			publicPath: options.isDev ? '/' : undefined,
			clean: true,
		},
		resolve: {
			extensions: extensionsBuilder(options),
			alias: aliasesBuilder(options),
		},
		devServer: options.isDev ? serverBuilder(options) : undefined,
		devtool: options.isDev ? 'eval-source-map' : undefined,
		module: {
			rules: loadersBuilder(options),
		},
		plugins: pluginsBuilder(options),
	};
};

export default createWebpackConfiguration;
