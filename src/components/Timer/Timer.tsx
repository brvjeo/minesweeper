import React, { FC, useEffect } from 'react';
import { TProcessStatus } from '../../types';
import { Counter } from '@components/Counter/Counter';
import { useTimer } from '../../hooks/useTimer';

type TProps = {
	status: TProcessStatus;
};

export const Timer: FC<TProps> = ({ status }) => {
	const { time, start, stop, reset } = useTimer();

	useEffect(() => {
		switch (status) {
			case 'started':
				start();
				break;
			case 'solved':
			case 'failed':
				stop();
				break;
			case 'idle':
			case 'resetted':
				reset();
				break;
		}
	}, [status]);

	return <Counter count={time} />;
};
