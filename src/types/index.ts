export type TProcessStatus = 'idle' | 'started' | 'failed' | 'resetted' | 'solved';

export type TCell = {
	point: TPoint;
	isBomb: boolean;
	isQuestion: boolean;
	isOpened: boolean;
	isFlag: boolean;
	isExploded: boolean;
	isWrong: boolean;
	count: number;
};

export type TGrid = {
	matrix: TMatrix;
	bombs: Array<TPoint>;
	opened: number;
	flags: number;
	questions: number;
	status: TProcessStatus;
};

export type TMatrix = Array<Array<TCell>>;

export type TPoint = { x: number; y: number };
