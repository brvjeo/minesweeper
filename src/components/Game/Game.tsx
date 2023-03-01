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
import { initializeGrid, setBackgroundImage } from '../../utils';
import {
	BOMBS_COUNT,
	GRID_HEIGHT,
	GRID_WIDTH,
	Reactions,
} from '../../constants';

let grid: Grid = [];

export const Game: FC = () => {
	const { time, start, reset } = useTimer();
	const [bombs, setBombs] = useState(BOMBS_COUNT);
	const [status, setStatus] = useState<ProcessStatus>('idle');

	useEffect(() => {
		initializeGrid(grid, GRID_WIDTH, GRID_HEIGHT);
	}, []);

	useEffect(() => {
		if (status === 'restarted') {
			reset();
			initializeGrid(grid, GRID_WIDTH, GRID_HEIGHT);
		}
	}, [status]);

	const resetButtonHandler: MouseEventHandler<HTMLButtonElement> =
		useCallback((event) => {
			switch (event.type) {
				case 'mouseup':
					event.currentTarget.style.backgroundImage =
						setBackgroundImage(Reactions.ReactionSmile);
					setStatus((state) => {
						if (state === 'started' || state === 'ended') {
							return 'restarted';
						} else {
							return state;
						}
					});
					break;
				case 'mousedown':
					event.currentTarget.style.backgroundImage =
						setBackgroundImage(Reactions.ReactionPushedSmile);
					break;
			}
		}, []);

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
			<div className={styles.grid}>
				<button
					onClick={() => {
						setStatus('started');
						start();
					}}
				>
					Start
				</button>
			</div>
		</div>
	);
};