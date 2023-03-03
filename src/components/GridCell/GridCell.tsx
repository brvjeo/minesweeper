import styles from './GridCell.module.scss';
import React, { CSSProperties, FC } from 'react';
import { TPoint } from '../../types';

type TProps = {
	style?: CSSProperties;
	point: TPoint;
};

export const GridCell: FC<TProps> = ({ style, point }) => {
	return <div data-x={point.x} data-y={point.y} className={styles.cell} style={style} />;
};
