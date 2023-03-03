import React, {
	BaseSyntheticEvent,
	FC,
	MouseEvent,
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
import { BOMBS_COUNT, Fields, Reactions } from '../../constants';
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

	useEffect(() => {
		if (state.status === 'ended') {
			resetRef.current.style.backgroundImage = setBackgroundImage(
				Reactions.ReactionSad
			);
		} else if (state.status === 'solved') {
			resetRef.current.style.backgroundImage = setBackgroundImage(
				Reactions.ReactionGlasses
			);
		}
	}, [state.status, resetRef.current, setBackgroundImage]);

	useEffect(() => {
		setState((state) => ({
			...state,
			matrix: fillMatrix(state.matrix),
		}));
	}, [fillMatrix]);

	const onResetClick = useCallback(
		({ type, currentTarget }: MouseEvent<HTMLButtonElement>) => {
			switch (type) {
				case 'mouseup':
					currentTarget.style.backgroundImage = setBackgroundImage(
						Reactions.ReactionSmile
					);
					if (
						state.status === 'started' ||
						state.status === 'ended' ||
						state.status === 'solved'
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
		[state.status, fillMatrix, setBackgroundImage]
	);

	const onLeftClick = useCallback(
		(event: MouseEvent<HTMLDivElement>) => {
			if (event.nativeEvent.button === 2) return;

			let point: Point;

			try {
				point = extractPoint(event.target as HTMLDivElement);
				if (
					state.matrix[point.x][point.y].isOpened ||
					state.matrix[point.x][point.y].isQuestion ||
					state.matrix[point.x][point.y].isFlag
				) {
					throw new Error();
				}
			} catch {
				return;
			}

			switch (event.type) {
				case 'mouseup':
					resetRef.current.style.backgroundImage = setBackgroundImage(
						Reactions.ReactionSmile
					);
					switch (state.status) {
						case 'idle':
							setState((state) => fillGrid(point, state));
							break;
						case 'started':
							setState((state) => openFields(point, state));
							break;
					}
					break;
				case 'mousedown':
					resetRef.current.style.backgroundImage = setBackgroundImage(
						Reactions.ReactionWow
					);
			}
		},
		[
			state.status,
			extractPoint,
			fillGrid,
			openFields,
			resetRef.current,
			setBackgroundImage,
		]
	);

	const onRightClick = useCallback(
		(event: MouseEvent<HTMLDivElement>) => {
			event.preventDefault();

			if (event.nativeEvent.button === 1) return;

			try {
				const point = extractPoint(event.target as HTMLDivElement);
				setState((state) => setFlagOrQuestion(point, state));
			} catch {
				return;
			}
		},
		[extractPoint, setFlagOrQuestion]
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
				onMouseUp={onLeftClick}
				onMouseDown={onLeftClick}
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
