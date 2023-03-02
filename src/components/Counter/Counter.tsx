import React, { FC } from 'react';
import styles from './Counter.module.scss';
import { Digits } from '../../constants';
import { formatCount } from '../../utils';

type Props = {
	count: number;
};

export const Counter: FC<Props> = ({ count }) => {
	return (
		<div className={styles.counter}>
			{[...formatCount(count)].map((digit, index) => {
				return <img key={index} src={Digits[digit]} />;
			})}
		</div>
	);
};
