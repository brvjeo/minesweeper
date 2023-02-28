import React, { CSSProperties, FC, MouseEventHandler } from 'react';
import styles from './GridCell.module.scss';
import { setBackgroundImage } from '../../utils';
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
	image,
	...props
}) => {
	return (
		<div
			className={styles.cell}
			style={{ backgroundImage: setBackgroundImage(image) }}
			{...props}
		/>
	);
};
