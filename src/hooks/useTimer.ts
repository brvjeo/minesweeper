import { useCallback, useEffect, useState } from 'react';
import { ProcessStatus } from '../types';

let interval: NodeJS.Timer;

export function useTimer() {
	const [status, setStatus] = useState<ProcessStatus>('idle');
	const [state, setState] = useState(0);

	useEffect(() => {
		switch (status) {
			case 'started':
				interval = setInterval(
					() => setState((state) => ++state),
					1000
				);
				break;
			case 'restarted':
				clearInterval(interval);
				setStatus('idle');
				break;
			case 'idle':
				setState(0);
				break;
			case 'ended':
				clearInterval(interval);
				break;
		}
	}, [status]);

	const start = useCallback(() => setStatus('started'), []);
	const stop = useCallback(() => setStatus('ended'), []);
	const reset = useCallback(() => setStatus('restarted'), []);

	return { time: state, start, stop, reset };
}
