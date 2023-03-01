import { Cell, Grid, Point } from '../types';
import {
	BOMBS_COUNT,
	Counts,
	Fields,
	GRID_HEIGHT,
	GRID_WIDTH,
} from '../constants';

export const fillGrid = (grid: Grid, width: number, height: number): void => {
	for (let x = 0; x < width; x++) {
		const row: Array<Cell> = [];
		for (let y = 0; y < height; y++) {
			row[y] = {
				id: crypto.randomUUID(),
				bombsAround: 0,
				isBomb: false,
				isFlag: false,
				isQuestion: false,
				point: { x, y },
				isOpened: false,
			};
		}
		grid[x] = row;
	}
};

export const launchGame = (x: number, y: number, grid: Grid): void => {
	const initialBombPoints = getAvailableBombPoints({ x, y });
	const bombs = BOMBS_COUNT - initialBombPoints.length;

	setCounter({ x, y }, initialBombPoints.length, grid);
	initialBombPoints.forEach(({ x, y }) => setBomb({ x, y }, grid));
};

export const getAvailableBombPoints = ({ x, y }: Point): Array<Point> => {
	const points: Array<Point> = [];
	const mapper: Record<number, Point> = {
		0: { x: x - 1, y: y - 1 },
		1: { x, y: y - 1 },
		2: { x: x + 1, y: y - 1 },
		3: { y, x: x + 1 },
		4: { y: y + 1, x: x + 1 },
		5: { x, y: y + 1 },
		6: { x: x - 1, y: y + 1 },
		7: { x: x - 1, y },
	};

	for (const point of Object.values(mapper)) {
		if (isInBounds(GRID_WIDTH, GRID_HEIGHT, point)) {
			points.push(point);
		}
	}

	const list = getRandomArray(
		0,
		points.length - 1,
		getRandom(1, points.length)
	);

	return list.map((value) => points[value]);
};

export const getRandomArray = (
	min: number,
	max: number,
	length: number
): Array<number> => {
	if (length > max - min + 1) {
		throw new Error('Invalid size or bounds!');
	}

	const set = new Set<number>();

	while (set.size < length) {
		set.add(getRandom(min, max));
	}

	return [...set];
};

export const setBomb = ({ x, y }: Point, grid: Grid): void => {
	grid[x][y].isBomb = true;
};

export const setCounter = (
	{ x, y }: Point,
	count: number,
	grid: Grid
): void => {
	grid[x][y].bombsAround = count;
};

export const isInBounds = (
	width: number,
	height: number,
	{ x, y }: Point
): boolean => {
	return x < width && x >= 0 && y < height && y >= 0;
};

export const defineField = (cell: Cell): string => {
	switch (true) {
		case cell.isBomb:
			return Fields.FieldBomb;
		case cell.bombsAround > 0:
			return Counts[cell.bombsAround];
		case cell.isFlag:
			return Fields.FieldFlag;
		case cell.isQuestion:
			return Fields.FieldQuestion;
		case cell.isOpened:
			return Fields.FieldClear;
		default:
			return Fields.FieldUnknown;
	}
};

export const getRandom = (min: number, max: number): number => {
	return Math.trunc(Math.random() * (max - min + 1) + min);
};

export const setBackgroundImage = (path: string): string => `url(${path})`;
