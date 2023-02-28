import path from 'path';
import { WebpackEnvironmentalVariable, WebpackPaths } from './configuration/types';
import createConfig from './configuration';

const paths: WebpackPaths = {
	src: path.resolve(__dirname, 'src'),
	build: path.resolve(__dirname, 'build'),
	extra: {
		html: path.resolve(__dirname, 'public'),
	}
};

export default ({ mode }: WebpackEnvironmentalVariable) =>
	createConfig({ mode, paths, isDev: mode === 'development' });
