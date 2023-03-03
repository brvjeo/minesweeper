import { Cell, Grid, Matrix, Point } from '../types';
import {
	BOMBS_COUNT,
	Counts,
	Fields,
	GRID_HEIGHT,
	GRID_WIDTH,
} from '../constants';

export const fillMatrix = (matrix: Matrix): Matrix => {
	for (let x = 0; x < GRID_WIDTH; x++) {
		const row: Array<Cell> = [];
		for (let y = 0; y < GRID_HEIGHT; y++) {
			row[y] = {
				point: { x, y },
				count: 0,
				isBomb: false,
				isFlag: false,
				isQuestion: false,
				isOpened: false,
				isExploded: false,
				isWrong: false,
			};
		}
		matrix[x] = row;
	}

	return matrix;
};

export const updateGrid = (grid: Grid): Grid => ({ ...grid });

export const setFlagOrQuestion = ({ x, y }: Point, grid: Grid): Grid => {
	const cell = grid.matrix[x][y];

	if (cell.isOpened) return grid;

	if (cell.isFlag) {
		cell.isQuestion = true;
		cell.isFlag = false;
		grid.questions++;
		grid.flags--;
	} else if (cell.isQuestion) {
		cell.isQuestion = false;
		grid.questions--;
	} else {
		cell.isFlag = true;
		grid.flags++;
	}

	return {
		...grid,
	};
};

export const fillGrid = (point: Point, grid: Grid): Grid => {
	const availablePoints: Array<Point> = [];

	for (let x = 0; x < GRID_WIDTH; x++) {
		for (let y = 0; y < GRID_HEIGHT; y++) {
			if (!pointsEqual({ x, y }, point)) {
				availablePoints.push({ x, y });
			}
		}
	}

	const indexes = getRandomArray(0, availablePoints.length - 1, BOMBS_COUNT);

	indexes.forEach((i) => {
		setBomb(availablePoints[i], grid);
		grid.bombs.push(availablePoints[i]);
		updateCounters(availablePoints[i], grid);
	});

	return {
		...openFields(point, grid),
		status: 'started',
	};
};

export const openFields = ({ x, y }: Point, grid: Grid): Grid => {
	if (grid.matrix[x][y].isBomb) {
		grid.status = 'ended';
		grid.matrix[x][y].isExploded = true;
		grid.bombs.forEach(({ x, y }) => {
			grid.opened++;
			grid.matrix[x][y].isOpened = true;
		});
	} else if (grid.matrix[x][y].count > 0) {
		grid.opened++;
		grid.matrix[x][y].isOpened = true;
	} else {
		const queue: Array<Point> = [{ x, y }];
		const visited: Array<Point> = [];

		while (queue.length) {
			const { x, y } = queue.shift();
			visited.push({ x, y });

			if (!grid.matrix[x][y].isOpened) {
				grid.matrix[x][y].isOpened = true;
				grid.opened++;
			}

			traverse({ x: x - 1, y: y - 1 }, grid, queue, visited);
			traverse({ x: x, y: y - 1 }, grid, queue, visited);
			traverse({ x: x + 1, y: y - 1 }, grid, queue, visited);
			traverse({ x: x + 1, y: y }, grid, queue, visited);
			traverse({ x: x + 1, y: y + 1 }, grid, queue, visited);
			traverse({ x: x, y: y + 1 }, grid, queue, visited);
			traverse({ x: x - 1, y: y + 1 }, grid, queue, visited);
			traverse({ x: x - 1, y: y }, grid, queue, visited);
		}
	}

	return { ...grid };
};

export const traverse = ({ x, y }: Point, grid: Grid, queue, visited) => {
	if (isInBounds({ x, y }) && isValidToTraverse(grid.matrix[x][y], visited)) {
		findWayToTraverse(grid.matrix[x][y], grid, queue, visited);
	}
};

export const findWayToTraverse = (
	cell: Cell,
	grid: Grid,
	queue: Array<Point>,
	visited: Array<Point>
) => {
	if (cell.count > 0) {
		if (!cell.isOpened) {
			cell.isOpened = true;
			grid.opened++;
		}
		visited.push(cell.point);
	} else {
		queue.push(cell.point);
	}
};

export const isValidToTraverse = (cell: Cell, visited: Array<Point>) => {
	return (
		!visited.find((point) => pointsEqual(point, cell.point)) && !cell.isBomb
	);
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

export const setBomb = ({ x, y }: Point, { matrix }: Grid): void => {
	matrix[x][y].isBomb = true;
};

export const setOpened = ({ x, y }: Point, { matrix }: Grid) => {
	matrix[x][y].isOpened = true;
};

export const updateCounters = ({ x, y }: Point, { matrix }: Grid) => {
	if (isInBounds({ x: x - 1, y: y - 1 }) && !matrix[x - 1][y - 1].isBomb) {
		matrix[x - 1][y - 1].count++;
	}
	if (isInBounds({ x, y: y - 1 }) && !matrix[x][y - 1].isBomb) {
		matrix[x][y - 1].count++;
	}
	if (isInBounds({ x: x + 1, y: y - 1 }) && !matrix[x + 1][y - 1].isBomb) {
		matrix[x + 1][y - 1].count++;
	}
	if (isInBounds({ x: x + 1, y }) && !matrix[x + 1][y].isBomb) {
		matrix[x + 1][y].count++;
	}
	if (isInBounds({ x: x + 1, y: y + 1 }) && !matrix[x + 1][y + 1].isBomb) {
		matrix[x + 1][y + 1].count++;
	}
	if (isInBounds({ x, y: y + 1 }) && !matrix[x][y + 1].isBomb) {
		matrix[x][y + 1].count++;
	}
	if (isInBounds({ x: x - 1, y: y + 1 }) && !matrix[x - 1][y + 1].isBomb) {
		matrix[x - 1][y + 1].count++;
	}
	if (isInBounds({ x: x - 1, y }) && !matrix[x - 1][y].isBomb) {
		matrix[x - 1][y].count++;
	}
};

export const isInBounds = ({ x, y }: Point): boolean => {
	return x < GRID_WIDTH && x >= 0 && y < GRID_HEIGHT && y >= 0;
};

export const defineField = (cell: Cell): string => {
	if (cell.isOpened) {
		if (cell.isBomb) {
			if (cell.isExploded) {
				return Fields.FieldExploded;
			} else if (cell.isWrong) {
				return Fields.FieldWrong;
			} else {
				return Fields.FieldBomb;
			}
		} else if (cell.count > 0) {
			return Counts[cell.count];
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
