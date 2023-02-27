import { WebpackBuilder } from '../types';

const extensionsBuilder: WebpackBuilder<string[]> = (options) => {
	return ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', 'jpeg', 'jpg', '.png', 'json'];
};

export default extensionsBuilder;
