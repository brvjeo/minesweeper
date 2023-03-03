import styles from './Game.module.scss';
import React, { FC, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Counter } from '@components/Counter/Counter';
import { TGrid, TPoint } from '../../types';
import {
	fillGrid,
	fillMatrix,
	setImage,
	extractPoint,
	setFlagOrQuestion,
	openFields,
	isNonOpening,
} from '../../utils';
import { BOMBS_COUNT, Reactions } from '../../constants';
import { Timer } from '@components/Timer/Timer';
import { Grid } from '@components/Grid/Grid';

export const Game: FC = () => {
	const ref = useRef<HTMLButtonElement>();
	const [state, setState] = useState<TGrid>({
		matrix: fillMatrix([]),
		opened: 0,
		flags: 0,
		questions: 0,
		bombs: [],
		status: 'idle',
	});

	useEffect(() => {
		switch (state.status) {
			case 'failed':
				ref.current.style.backgroundImage = setImage(Reactions.ReactionSad);
				break;
			case 'solved':
				ref.current.style.backgroundImage = setImage(Reactions.ReactionGlasses);
				break;
		}
	}, [state.status]);

	const resetClickHandler = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => {
			switch (event.type) {
				case 'mouseup':
					event.currentTarget.style.backgroundImage = setImage(Reactions.ReactionSmile);
					if (state.status !== 'idle') {
						setState({
							matrix: fillMatrix([]),
							opened: 0,
							flags: 0,
							questions: 0,
							bombs: [],
							status: 'idle',
						});
					}
					break;
				case 'mousedown':
					event.currentTarget.style.backgroundImage = setImage(
						Reactions.ReactionPushedSmile
					);
					break;
			}
		},
		[state.status]
	);

	const gridClickHandler = useCallback(
		(event: MouseEvent<HTMLDivElement>) => {
			event.preventDefault();

			if (state.status === 'failed' || state.status === 'solved') return;

			let point: TPoint;

			try {
				point = extractPoint(event.target as HTMLDivElement);
			} catch {
				return;
			}

			if (event.nativeEvent.button === 2 && event.type === 'contextmenu') {
				setState((state) => setFlagOrQuestion(point, state));
				return;
			} else if (event.nativeEvent.button !== 0) {
				return;
			}

			if (isNonOpening(point, state)) return;

			switch (event.type) {
				case 'mouseup':
					ref.current.style.backgroundImage = setImage(Reactions.ReactionSmile);
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
					ref.current.style.backgroundImage = setImage(Reactions.ReactionWow);
			}
		},
		[state.status, state]
	);

	return (
		<div className={styles.panel}>
			<div className={styles.header}>
				<Counter count={BOMBS_COUNT - state.flags} />
				<button
					ref={ref}
					className={styles.reset}
					style={{
						backgroundImage: setImage(Reactions.ReactionSmile),
					}}
					onMouseUp={resetClickHandler}
					onMouseDown={resetClickHandler}
				/>
				<Timer status={state.status} />
			</div>
			<Grid
				grid={state}
				onMouseDown={gridClickHandler}
				onMouseUp={gridClickHandler}
				onContextMenu={gridClickHandler}
			/>
		</div>
	);
};
