export type ProcessStatus = 'idle' | 'started' | 'ended' | 'restarted';

export type Cell = {
	id: string;
	isBomb: boolean;
	isQuestion: boolean;
	isOpened: boolean;
	isFlag: boolean;
	bombsAround: number;
	point: Point;
};

export type Point = {
	x: number;
	y: number;
};

export type Grid = Array<Array<Cell>>;
