import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { WebpackBuilder } from '../types';

const loadersBuilder: WebpackBuilder<webpack.RuleSetRule[]> = ({ isDev }) => {
	return [
		{
			test: /\.s?css$/,
			use: [
				isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
				{
					loader: 'css-loader',
					options: {
						modules: {
							auto: (path: string) => !!path.includes('.module.'),
							localIdentName: isDev
								? '[name]__[local]--[hash:base64:5]'
								: '[hash:base64:8]',
						},
					},
				},
				'sass-loader',
			],
		},
		{
			test: /\.(js|ts|tsx|jsx)$/,
			exclude: /node_modules/,
			use: 'babel-loader',
		},
		{
			test: /\.(png|jpg|jpeg|gif|svg)$/,
			type: 'asset/resource',
		},
		{
			test: /\.json$/,
			use: 'json-loader',
		},
	];
};

export default loadersBuilder;
