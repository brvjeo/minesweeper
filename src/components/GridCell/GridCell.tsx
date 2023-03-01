import React, { CSSProperties, FC, MouseEventHandler } from 'react';
import styles from './GridCell.module.scss';
import { Cell } from '../../types';

type Props = Cell & {
	onClick: MouseEventHandler<HTMLDivElement>;
	onMouseDown: MouseEventHandler<HTMLDivElement>;
	onMouseUp: MouseEventHandler<HTMLDivElement>;
	className?: string;
	style?: CSSProperties;
};

export const GridCell: FC<Props> = ({
	id,
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
