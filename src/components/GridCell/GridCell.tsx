import React, { CSSProperties, FC } from 'react';
import styles from './GridCell.module.scss';
import { Point } from '../../types';

type Props = {
	style?: CSSProperties;
	point: Point;
};

export const GridCell: FC<Props> = ({ style, point }) => {
	return (
		<div
			data-x={point.x}
			data-y={point.y}
			className={styles.cell}
			style={style}
		/>
	);
};
