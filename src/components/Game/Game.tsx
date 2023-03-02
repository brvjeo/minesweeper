import React, {
	BaseSyntheticEvent,
	FC,
	MouseEventHandler,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { Counter } from '@components/Counter/Counter';
import { useTimer } from '../../hooks/useTimer';
import styles from './Game.module.scss';
import { Cell, Grid, Point, ProcessStatus } from '../../types';
import {
	defineField,
	launchGame,
	fillGrid,
	setBackgroundImage,
	formatCount,
	extractPoint,
	setOpened,
} from '../../utils';
import {
	BOMBS_COUNT,
	Fields,
	GRID_HEIGHT,
	GRID_WIDTH,
	Reactions,
} from '../../constants';
import { GridCell } from '@components/GridCell/GridCell';
import { Timer } from '@components/Timer/Timer';

let grid: Grid = [];

export const Game: FC = () => {
	const [bombs, setBombs] = useState(BOMBS_COUNT);
	const [gridState, setGridState] = useState<Grid>(grid);
	const [status, setStatus] = useState<ProcessStatus>('idle');

	useEffect(() => {
		fillGrid(grid, GRID_WIDTH, GRID_HEIGHT);
		setGridState(grid.slice());
	}, []);

	useEffect(() => {
		if (status === 'restarted') {
			fillGrid(grid, GRID_WIDTH, GRID_HEIGHT);
			setGridState(grid.slice());
		}
	}, [status]);

	const onResetClick = useCallback(
		(event: BaseSyntheticEvent) => {
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

	const onLeftClick = useCallback(
		(event: BaseSyntheticEvent) => {
			let point: Point;

			try {
				point = extractPoint(event.target);
				if (
					grid[point.x][point.y].isOpened ||
					grid[point.x][point.y].isQuestion ||
					grid[point.x][point.y].isFlag
				) {
					throw new Error();
				}
			} catch {
				return;
			}

			switch (status) {
				case 'restarted':
				case 'idle':
					launchGame(point.x, point.y, grid);
					setOpened(point, grid);
					setGridState(grid.slice(0));
					setStatus('started');
					break;
				case 'started':
					setOpened(point, grid);
					setGridState(grid.slice(0));
					break;
			}
		},
		[status]
	);

	const onRightClick = useCallback(
		(event: BaseSyntheticEvent) => {
			event.preventDefault();

			let cell: Cell;

			try {
				const point = extractPoint(event.target);
				cell = grid[point.x][point.y];
				if (cell.isOpened) throw new Error();
			} catch {
				return;
			}

			if (cell.isFlag) {
				cell.isQuestion = true;
				cell.isFlag = false;
				setBombs((value) => ++value);
			} else if (cell.isQuestion) {
				cell.isQuestion = false;
			} else {
				cell.isFlag = true;
				setBombs((value) => --value);
			}

			setGridState(grid.slice(0));
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
					onMouseUp={onResetClick}
					onMouseDown={onResetClick}
				/>
				<Timer status={status} />
			</div>
			<div
				className={styles.grid}
				onClick={onLeftClick}
				onContextMenu={onRightClick}
			>
				{gridState.map((row, x) => {
					return (
						<div key={x}>
							{row.map((cell, y) => {
								return (
									<GridCell
										key={x + '_' + y}
										style={{
											backgroundImage: setBackgroundImage(
												defineField(cell)
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
