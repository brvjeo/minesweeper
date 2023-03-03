import React, { FC, useEffect } from 'react';
import { ProcessStatus } from '../../types';
import { Counter } from '@components/Counter/Counter';
import { useTimer } from '../../hooks/useTimer';

type Props = {
	status: ProcessStatus;
};

export const Timer: FC<Props> = ({ status }) => {
	const { time, start, stop, reset } = useTimer();

	useEffect(() => {
		switch (status) {
			case 'started':
				start();
				break;
			case 'solved':
			case 'ended':
				stop();
				break;
			case 'idle':
			case 'restarted':
				reset();
				break;
		}
	}, [status]);

	return <Counter count={time} />;
};
