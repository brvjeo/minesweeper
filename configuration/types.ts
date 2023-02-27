import webpack from 'webpack';

export interface WebpackBuilder<T> {
	(options: WebpackBuildOptions): T;
}

export interface WebpackPaths {
	src: string;
	build: string;
	extra: {
		html: string;
		[path: string]: string;
	};
}

export type WebpackMode = webpack.Configuration['mode'];

export interface WebpackEnvironmentalVariable {
	mode: WebpackMode;
}

export interface WebpackBuildOptions {
	paths: WebpackPaths;
	mode: WebpackMode;
	isDev: boolean;
}
