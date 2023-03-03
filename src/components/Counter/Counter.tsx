import styles from './Counter.module.scss';
import React, { FC } from 'react';
import { Digits } from '../../constants';
import { formatToTabloidDigits } from '../../utils/index';

type TProps = {
	count: number;
};

export const Counter: FC<TProps> = ({ count }) => {
	return (
		<div className={styles.counter}>
			{formatToTabloidDigits(count).map((digit, i) => (
				<img key={i} src={Digits[digit]} />
			))}
		</div>
	);
};
