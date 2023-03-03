import styles from './Grid.module.scss';
import React, { FC, HTMLAttributes } from 'react';
import { TGrid } from '../../types';
import { GridCell } from '@components/GridCell/GridCell';
import { defineField, setImage } from '../../utils';

type TProps = Pick<
	HTMLAttributes<HTMLDivElement>,
	'onMouseDown' | 'onMouseUp' | 'onContextMenu'
> & {
	grid: TGrid;
};

export const Grid: FC<TProps> = ({ grid, ...props }) => {
	return (
		<div className={styles.grid} {...props}>
			{grid.matrix.map((row, x) => {
				return (
					<div key={x}>
						{row.map((cell, y) => {
							return (
								<GridCell
									key={x + '_' + y}
									style={{
										backgroundImage: setImage(defineField(cell)),
									}}
									point={cell.point}
								/>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};
