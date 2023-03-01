import React, {
	FC,
	MouseEventHandler,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { Counter } from '@components/Counter/Counter';
import { useTimer } from '../../hooks/useTimer';
import styles from './Game.module.scss';
import { Grid, ProcessStatus } from '../../types';
import {
	defineField,
	launchGame,
	fillGrid,
	setBackgroundImage,
} from '../../utils';
import {
	BOMBS_COUNT,
	Fields,
	GRID_HEIGHT,
	GRID_WIDTH,
	Reactions,
} from '../../constants';
import { GridCell } from '@components/GridCell/GridCell';

let grid: Grid = [];

export const Game: FC = () => {
	const { time, start, reset } = useTimer();
	const [bombs, setBombs] = useState(BOMBS_COUNT);
	const [gridState, setGridState] = useState<Grid>(grid);
	const [status, setStatus] = useState<ProcessStatus>('idle');

	useEffect(() => {
		fillGrid(grid, GRID_WIDTH, GRID_HEIGHT);
		setGridState(grid.slice());
	}, []);

	useEffect(() => {
		if (status === 'restarted') {
			reset();
			fillGrid(grid, GRID_WIDTH, GRID_HEIGHT);
			setGridState(grid.slice());
		} else if (status === 'started') {
			start();
		}
	}, [status]);

	const resetButtonHandler: MouseEventHandler<HTMLButtonElement> =
		useCallback(
			(event) => {
				switch (event.type) {
					case 'mouseup':
						event.currentTarget.style.backgroundImage =
							setBackgroundImage(Reactions.ReactionSmile);
						if (status === 'started') {
							setStatus('restarted');
						}
						break;
					case 'mousedown':
						event.currentTarget.style.backgroundImage =
							setBackgroundImage(Reactions.ReactionPushedSmile);
						break;
				}
			},
			[status]
		);

	const gridFieldHandler: MouseEventHandler<HTMLDivElement> = useCallback(
		(event) => {
			const cell = event.target as HTMLDivElement;
			const dataX = cell.attributes.getNamedItem('data-x');
			const dataY = cell.attributes.getNamedItem('data-y');

			if (!dataX || !dataY) return;

			if (grid[+dataX.value][+dataY.value].isOpened) return;

			switch (status) {
				case 'restarted':
				case 'idle':
					launchGame(+dataX.value, +dataY.value, grid);
					grid[+dataX.value][+dataY.value].isOpened = true;
					setGridState(grid.slice(0));
					setStatus('started');
					break;
				case 'started':
					grid[+dataX.value][+dataY.value].isOpened = true;
					setGridState(grid.slice(0));
					break;
			}
		},
		[status]
	);

	return (
		<div className={styles.panel}>
			<div className={styles.header}>
				<Counter count={bombs} />
				<button
					className={styles.reset}
					style={{
						backgroundImage: setBackgroundImage(
							Reactions.ReactionSmile
						),
					}}
					onMouseUp={resetButtonHandler}
					onMouseDown={resetButtonHandler}
				/>
				<Counter count={time} />
			</div>
			<div className={styles.grid} onClick={gridFieldHandler}>
				{gridState.map((row, x) => {
					return (
						<div key={x}>
							{row.map((cell, y) => {
								return (
									<GridCell
										key={x + '_' + y}
										onClick={undefined}
										onMouseDown={undefined}
										onMouseUp={undefined}
										style={{
											backgroundImage: setBackgroundImage(
												cell.isOpened
													? defineField(cell)
													: Fields.FieldUnknown
											),
										}}
										{...cell}
									/>
								);
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
};
