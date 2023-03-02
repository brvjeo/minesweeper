import React, {
	BaseSyntheticEvent,
	FC,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import { Counter } from '@components/Counter/Counter';
import styles from './Game.module.scss';
import { Grid, Point, ProcessStatus } from '../../types';
import {
	defineField,
	fillGrid,
	fillMatrix,
	setBackgroundImage,
	extractPoint,
	setFlagOrQuestion,
	openFields,
} from '../../utils';
import { BOMBS_COUNT, Reactions } from '../../constants';
import { GridCell } from '@components/GridCell/GridCell';
import { Timer } from '@components/Timer/Timer';

const grid: Grid = {
	matrix: [],
	opened: 0,
	flags: 0,
	questions: 0,
	bombs: [],
	status: 'idle',
};

export const Game: FC = () => {
	const resetRef = useRef<HTMLButtonElement>();
	const [state, setState] = useState<Grid>(grid);

	useEffect(() => console.log(state));

	useEffect(() => {
		if (state.status === 'ended') {
			resetRef.current.style.backgroundImage = setBackgroundImage(
				Reactions.ReactionSad
			);
		}
	}, [state.status]);

	useEffect(() => {
		setState((state) => ({
			...state,
			matrix: fillMatrix(state.matrix),
		}));
	}, []);

	const onResetClick = useCallback(
		({ type, currentTarget }: BaseSyntheticEvent) => {
			switch (type) {
				case 'mouseup':
					currentTarget.style.backgroundImage = setBackgroundImage(
						Reactions.ReactionSmile
					);
					if (
						state.status === 'started' ||
						state.status === 'ended'
					) {
						setState((state) => ({
							matrix: fillMatrix([]),
							opened: 0,
							flags: 0,
							questions: 0,
							bombs: [],
							status: 'idle',
						}));
					}
					break;
				case 'mousedown':
					currentTarget.style.backgroundImage = setBackgroundImage(
						Reactions.ReactionPushedSmile
					);
					break;
			}
		},
		[state.status]
	);

	const onLeftClick = useCallback(
		(event: BaseSyntheticEvent) => {
			let point: Point;

			try {
				point = extractPoint(event.target);
				if (
					state.matrix[point.x][point.y].isOpened ||
					state.matrix[point.x][point.y].isQuestion ||
					state.matrix[point.x][point.y].isFlag
				) {
					throw new Error();
				}
				console.log(state.matrix[point.x][point.y]);
			} catch {
				return;
			}

			switch (state.status) {
				case 'idle':
					setState((state) => fillGrid(point, state));
					break;
				case 'started':
					setState((state) => openFields(point, state));
					break;
			}
		},
		[state.status]
	);

	const onRightClick = useCallback(
		(event: BaseSyntheticEvent) => {
			event.preventDefault();

			try {
				const point = extractPoint(event.target);
				setState((state) => setFlagOrQuestion(point, state));
			} catch {
				return;
			}
		},
		[extractPoint]
	);

	return (
		<div className={styles.panel}>
			<div className={styles.header}>
				<Counter count={BOMBS_COUNT - state.flags} />
				<button
					ref={resetRef}
					className={styles.reset}
					style={{
						backgroundImage: setBackgroundImage(
							Reactions.ReactionSmile
						),
					}}
					onMouseUp={onResetClick}
					onMouseDown={onResetClick}
				/>
				<Timer status={state.status} />
			</div>
			<div
				className={styles.grid}
				onClick={onLeftClick}
				onContextMenu={onRightClick}
			>
				{state.matrix.map((row, x) => {
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
										point={cell.point}
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
