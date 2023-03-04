import { TCell, TGrid, TMatrix, TPoint } from '../types';
import { BOMBS_COUNT, Counts, Fields, GRID_HEIGHT, GRID_WIDTH } from '../constants';

export const fillMatrix = (matrix: TMatrix): TMatrix => {
	for (let x = 0; x < GRID_WIDTH; x++) {
		const row: Array<TCell> = [];
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

export const setFlagOrQuestion = ({ x, y }: TPoint, grid: TGrid): TGrid => {
	switch (true) {
		case grid.matrix[x][y].isOpened:
			return grid;
		case grid.matrix[x][y].isFlag:
			setQuestion(grid.matrix[x][y].point, grid);
			unsetFlag(grid.matrix[x][y].point, grid);
			break;
		case grid.matrix[x][y].isQuestion:
			unsetQuestion(grid.matrix[x][y].point, grid);
			break;
		default:
			if (grid.flags < BOMBS_COUNT) {
				setFlag(grid.matrix[x][y].point, grid);
			} else {
				return grid;
			}
	}

	return {
		...grid,
	};
};

export const fillGrid = (point: TPoint, grid: TGrid): TGrid => {
	const points: Array<TPoint> = [];

	for (let x = 0; x < GRID_WIDTH; x++) {
		for (let y = 0; y < GRID_HEIGHT; y++) {
			if (!pointsEqual({ x, y }, point)) {
				points.push({ x, y });
			}
		}
	}

	const indexes = getRandomArray(0, points.length - 1, BOMBS_COUNT);

	indexes.forEach((i) => {
		setBomb(points[i], grid);
		updateCounters(points[i], grid);
	});

	return {
		...openFields(point, grid),
		status: 'started',
	};
};

export const openFields = ({ x, y }: TPoint, grid: TGrid): TGrid => {
	if (grid.matrix[x][y].isBomb) {
		setExploded({ x, y }, grid);
		openAllBombs(grid);
		checkForWrongFlags({ x, y }, grid);
	} else if (grid.matrix[x][y].count > 0) {
		setOpened({ x, y }, grid);
	} else {
		openClearArea({ x, y }, grid);
	}

	if (grid.opened === GRID_WIDTH * GRID_HEIGHT - grid.bombs.length) {
		grid.status = 'solved';
	}

	return { ...grid };
};

export const openClearArea = ({ x, y }: TPoint, grid: TGrid) => {
	const queue: Array<TPoint> = [{ x, y }];
	const visited: Array<TPoint> = [];

	while (queue.length) {
		const { x, y } = queue.shift();
		visited.push({ x, y });

		if (!grid.matrix[x][y].isOpened) {
			setOpened({ x, y }, grid);
			if (grid.matrix[x][y].isFlag) {
				unsetFlag({ x, y }, grid);
			} else if (grid.matrix[x][y].isQuestion) {
				unsetQuestion({ x, y }, grid);
			}
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
};

export const checkForWrongFlags = (point: TPoint, grid: TGrid) => {
	getRadiusPoints(point).forEach(({ x, y }) => {
		if (grid.matrix[x][y].isFlag && !grid.matrix[x][y].isBomb) {
			setWrong({ x, y }, grid);
		}
	});
};

export const traverse = ({ x, y }: TPoint, grid: TGrid, queue, visited) => {
	if (isInBounds({ x, y }) && isValidToTraverse(grid.matrix[x][y], visited)) {
		findWayToTraverse(grid.matrix[x][y], grid, queue, visited);
	}
};

export const findWayToTraverse = (
	cell: TCell,
	grid: TGrid,
	queue: Array<TPoint>,
	visited: Array<TPoint>
) => {
	if (cell.count > 0) {
		if (!cell.isOpened) {
			setOpened(cell.point, grid);
			if (cell.isFlag) {
				unsetFlag(cell.point, grid);
			} else if (cell.isQuestion) {
				unsetQuestion(cell.point, grid);
			}
		}
		visited.push(cell.point);
	} else {
		queue.push(cell.point);
	}
};

export const isValidToTraverse = (cell: TCell, visited: Array<TPoint>) => {
	return !visited.find((point) => pointsEqual(point, cell.point)) && !cell.isBomb;
};

export const getRandomArray = (min: number, max: number, length: number): Array<number> => {
	if (length > max - min + 1) {
		throw new Error('Invalid size or bounds!');
	}

	const set = new Set<number>();

	while (set.size < length) {
		set.add(getRandom(min, max));
	}

	return [...set];
};

export const setBomb = ({ x, y }: TPoint, { matrix, bombs }: TGrid): void => {
	matrix[x][y].isBomb = true;
	bombs.push({ x, y });
};

export const setOpened = ({ x, y }: TPoint, grid: TGrid) => {
	grid.matrix[x][y].isOpened = true;
	grid.opened++;
};

export const setExploded = ({ x, y }: TPoint, grid: TGrid) => {
	grid.status = 'failed';
	grid.matrix[x][y].isExploded = true;
};

export const setWrong = ({ x, y }: TPoint, grid: TGrid) => {
	grid.matrix[x][y].isWrong = true;
	grid.matrix[x][y].isOpened = true;
};

export const unsetFlag = ({ x, y }: TPoint, grid: TGrid) => {
	grid.matrix[x][y].isFlag = false;
	grid.flags--;
};

export const setFlag = ({ x, y }: TPoint, grid: TGrid) => {
	grid.matrix[x][y].isFlag = true;
	grid.flags++;
};

export const unsetQuestion = ({ x, y }: TPoint, grid: TGrid) => {
	grid.matrix[x][y].isQuestion = false;
	grid.questions--;
};

export const setQuestion = ({ x, y }: TPoint, grid: TGrid) => {
	grid.matrix[x][y].isQuestion = true;
	grid.questions++;
};

export const openAllBombs = (grid: TGrid) => {
	grid.bombs.forEach(({ x, y }) => {
		if (!grid.matrix[x][y].isFlag) {
			setOpened({ x, y }, grid);
		}
	});
};

export const updateCounters = (point: TPoint, { matrix }: TGrid) => {
	getRadiusPoints(point).forEach(({ x, y }) => {
		if (!matrix[x][y].isBomb) {
			matrix[x][y].count++;
		}
	});
};

export const isInBounds = ({ x, y }: TPoint): boolean => {
	return x < GRID_WIDTH && x >= 0 && y < GRID_HEIGHT && y >= 0;
};

export const defineField = (cell: TCell): string => {
	if (cell.isOpened) {
		if (cell.isBomb) {
			if (cell.isExploded) {
				return Fields.FieldExploded;
			} else {
				return Fields.FieldBomb;
			}
		} else if (cell.isWrong) {
			return Fields.FieldWrong;
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

export const pointsEqual = (a: TPoint, b: TPoint) => {
	return a.x === b.x && a.y === b.y;
};

export const setImage = (path: string): string => `url(${path})`;

export const extractPoint = ({ attributes }: HTMLDivElement): TPoint => {
	const x = attributes.getNamedItem('data-x');
	const y = attributes.getNamedItem('data-y');

	if (x !== undefined && y !== undefined) {
		return { x: +x.value, y: +y.value };
	} else {
		throw new Error('!Cell');
	}
};

export const isNonOpening = ({ x, y }: TPoint, grid: TGrid) =>
	grid.matrix[x][y].isFlag || grid.matrix[x][y].isQuestion || grid.matrix[x][y].isOpened;

export const formatToTabloidDigits = (number: number): Array<string> => {
	let prefix = '';
	try {
		prefix += '0'.repeat(3 - String(number).length);
	} finally {
		return [...(prefix + String(number))];
	}
};

export const getRadiusPoints = ({ x, y }: TPoint): Array<TPoint> => {
	return [
		{
			x: x - 1,
			y: y - 1,
		},
		{
			x: x,
			y: y - 1,
		},
		{
			x: x + 1,
			y: y - 1,
		},
		{
			x: x + 1,
			y: y,
		},
		{
			x: x + 1,
			y: y + 1,
		},
		{
			x: x,
			y: y + 1,
		},
		{
			x: x - 1,
			y: y + 1,
		},
		{
			x: x - 1,
			y: y,
		},
	].filter(isInBounds);
};
