import React, { CSSProperties, FC } from 'react';
import styles from './GridCell.module.scss';
import { Cell } from '../../types';

type Props = Cell & {
	style?: CSSProperties;
};

export const GridCell: FC<Props> = ({
	isBomb,
	isQuestion,
	isFlag,
	bombsAround,
	point,
	isOpened,
	...props
}) => {
	return (
		<div
			data-x={point.x}
			data-y={point.y}
			className={styles.cell}
			{...props}
		/>
	);
};
