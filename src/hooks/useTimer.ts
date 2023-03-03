import { useCallback, useLayoutEffect, useState } from 'react';
import { TProcessStatus } from '../types';

let interval: NodeJS.Timer;

export function useTimer() {
	const [status, setStatus] = useState<TProcessStatus>('idle');
	const [state, setState] = useState(0);

	useLayoutEffect(() => {
		switch (status) {
			case 'started':
				interval = setInterval(() => setState((state) => ++state), 1000);
				break;
			case 'resetted':
				clearInterval(interval);
				setStatus('idle');
				break;
			case 'idle':
				setState(0);
				break;
			case 'failed':
				clearInterval(interval);
				break;
		}
	}, [status]);

	const start = useCallback(() => setStatus('started'), []);
	const stop = useCallback(() => setStatus('failed'), []);
	const reset = useCallback(() => setStatus('resetted'), []);

	return { time: state, start, stop, reset };
}
