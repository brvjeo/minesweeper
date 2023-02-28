export type ProcessStatus = 'idle' | 'started' | 'ended' | 'restarted';

export type Cell = {
	id: string;
	isBomb: boolean;
	isQuestion: boolean;
	isFlag: boolean;
	bombsAround: number;
	image: string;
};

export type Grid = Array<Array<Cell>>;
