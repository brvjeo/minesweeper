export type ProcessStatus = 'idle' | 'started' | 'ended' | 'restarted';

export type Cell = {
	point: Point;
	isBomb: boolean;
	isQuestion: boolean;
	isOpened: boolean;
	isFlag: boolean;
	isExploded: boolean;
	isWrong: boolean;
	count: number;
};

export type Grid = {
	matrix: Matrix;
	bombs: Array<Point>;
	opened: number;
	flags: number;
	questions: number;
	status: ProcessStatus;
};

export type Matrix = Array<Array<Cell>>;

export type Point = {
	x: number;
	y: number;
};
