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
	const initialBombs = getAvailableBombPoints({ x, y });

	initialBombs.forEach((point) => {
		setBomb(point, grid);
		updateCounters(point, grid);
	});
	fillBombs({ x, y }, initialBombs, grid);
};

export const fillBombs = (
	point: Point,
	exclude: Array<Point>,
	grid: Grid
): void => {
	const points: Array<Point> = [];

	for (let x = 0; x < GRID_WIDTH; x++) {
		for (let y = 0; y < GRID_HEIGHT; y++) {
			if (!isInSquare({ x, y }, point)) {
				points.push({ x, y });
			}
		}
	}

	const indexes = getRandomArray(0, points.length - 1, 40 - exclude.length);
	return indexes.forEach((i) => {
		setBomb(points[i], grid);
		updateCounters(points[i], grid);
	});
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

export const setOpened = ({ x, y }: Point, grid: Grid) => {
	grid[x][y].isOpened = true;
};

export const updateCounters = ({ x, y }: Point, grid: Grid) => {
	if (
		isInBounds(GRID_WIDTH, GRID_HEIGHT, { x: x - 1, y: y - 1 }) &&
		!grid[x - 1][y - 1].isBomb
	) {
		grid[x - 1][y - 1].bombsAround++;
	}
	if (
		isInBounds(GRID_WIDTH, GRID_HEIGHT, { x, y: y - 1 }) &&
		!grid[x][y - 1].isBomb
	) {
		grid[x][y - 1].bombsAround++;
	}
	if (
		isInBounds(GRID_WIDTH, GRID_HEIGHT, { x: x + 1, y: y - 1 }) &&
		!grid[x + 1][y - 1].isBomb
	) {
		grid[x + 1][y - 1].bombsAround++;
	}
	if (
		isInBounds(GRID_WIDTH, GRID_HEIGHT, { x: x + 1, y }) &&
		!grid[x + 1][y].isBomb
	) {
		grid[x + 1][y].bombsAround++;
	}
	if (
		isInBounds(GRID_WIDTH, GRID_HEIGHT, { x: x + 1, y: y + 1 }) &&
		!grid[x + 1][y + 1].isBomb
	) {
		grid[x + 1][y + 1].bombsAround++;
	}
	if (
		isInBounds(GRID_WIDTH, GRID_HEIGHT, { x, y: y + 1 }) &&
		!grid[x][y + 1].isBomb
	) {
		grid[x][y + 1].bombsAround++;
	}
	if (
		isInBounds(GRID_WIDTH, GRID_HEIGHT, { x: x - 1, y: y + 1 }) &&
		!grid[x - 1][y + 1].isBomb
	) {
		grid[x - 1][y + 1].bombsAround++;
	}
	if (
		isInBounds(GRID_WIDTH, GRID_HEIGHT, { x: x - 1, y }) &&
		!grid[x - 1][y].isBomb
	) {
		grid[x - 1][y].bombsAround++;
	}
};

export const isInBounds = (
	width: number,
	height: number,
	{ x, y }: Point
): boolean => {
	return x < width && x >= 0 && y < height && y >= 0;
};

export const isInSquare = (point: Point, target: Point) => {
	return (
		pointsEqual(point, target) ||
		(point.x == target.x - 1 && point.y == target.y - 1) ||
		(point.x == target.x && point.y == target.y - 1) ||
		(point.x == target.x + 1 && point.y == target.y - 1) ||
		(point.x == target.x + 1 && point.y == target.y) ||
		(point.x == target.x + 1 && point.y == target.y + 1) ||
		(point.x == target.x && point.y == target.y + 1) ||
		(point.x == target.x - 1 && point.y == target.y + 1) ||
		(point.x == target.x - 1 && point.y == target.y)
	);
};

export const defineField = (cell: Cell): string => {
	if (cell.isOpened) {
		if (cell.isBomb) {
			return Fields.FieldBomb;
		} else if (cell.bombsAround > 0) {
			return Counts[cell.bombsAround];
		} else {
			return Fields.FieldClear;
		}
	} else {
		if (cell.isFlag) {
			return Fields.FieldFlag;
		} else if (cell.isQuestion) {
			return Fields.FieldQuestion;
		} else {
			return Fields.FieldUnknown;
		}
	}
};

export const getRandom = (min: number, max: number): number => {
	return Math.trunc(Math.random() * (max - min + 1) + min);
};

export const pointsEqual = (a: Point, b: Point) => {
	return a.x === b.x && a.y === b.y;
};

export const setBackgroundImage = (path: string): string => `url(${path})`;

export const formatCount = (number: number) => {
	let prefix = '';
	try {
		prefix += '0'.repeat(3 - String(number).length);
	} finally {
		return prefix + String(number);
	}
};

export const extractPoint = (target: HTMLDivElement): Point => {
	const x = target.attributes.getNamedItem('data-x');
	const y = target.attributes.getNamedItem('data-y');

	if (x !== undefined && y !== undefined) {
		return { x: +x.value, y: +y.value };
	} else {
		throw new Error('!Cell');
	}
};
