import { WebpackBuilder } from '../types';
import path from 'path';

type Aliases = {
	[key: string]: string;
};

const aliasesBuilder: WebpackBuilder<Aliases> = (options) => {
	return {
		'@': path.join(options.paths.src),
		'@components': path.join(options.paths.src, 'components'),
		'@features': path.join(options.paths.src, 'features'),
		'@services': path.join(options.paths.src, 'services'),
		'@styles': path.join(options.paths.src, 'styles'),
		'@assets': path.join(options.paths.src, 'assets'),
		'@data': path.join(options.paths.src, 'data'),
		'@store': path.join(options.paths.src, 'store'),
		'@hooks': path.join(options.paths.src, 'hooks'),
		'@utils': path.join(options.paths.src, 'utils'),
		'@pages': path.join(options.paths.src, 'pages'),
		'@types': path.join(options.paths.src, 'types'),
	};
};

export default aliasesBuilder;
