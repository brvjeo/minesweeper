import React, { FC } from 'react';
import styles from './Counter.module.scss';
import { Digits } from '../../constants';

type Props = {
	count: number;
};

export const Counter: FC<Props> = ({ count }) => {
	return (
		<div className={styles.counter}>
			{count < 10 && <img src={Digits[0]} />}
			{count < 100 && <img src={Digits[0]} />}
			{[...String(count)].map((digit, index) => {
				return (
					<img key={`${Digits[digit]}${index}`} src={Digits[digit]} />
				);
			})}
		</div>
	);
};
