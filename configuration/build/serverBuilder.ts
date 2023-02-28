import { WebpackBuilder } from '../types';
import webpackDevServer from 'webpack-dev-server';

const serverBuilder: WebpackBuilder<webpackDevServer.Configuration> = (option) => {
	return {
		historyApiFallback: true,
		port: 3000,
		client: {
			overlay: {
				warnings: false,
				errors: true,
			},
		},
	};
};

export default serverBuilder;
