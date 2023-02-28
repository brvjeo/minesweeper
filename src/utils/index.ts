import { Cell, Grid } from '../types';
import { Fields } from '../constants';

export const setBackgroundImage = (path: string): string => `url(${path})`;

export const initializeGrid = (
	grid: Grid,
	width: number,
	height: number
): void => {
	grid.length = 0;
	for (let x = 0; x < width; x++) {
		const row: Array<Cell> = [];
		for (let y = 0; y < width; y++) {
			row.push({
				id: crypto.randomUUID(),
				bombsAround: 0,
				image: Fields.FieldUnknown,
				isBomb: false,
				isFlag: false,
				isQuestion: false,
			});
		}
		grid.push(row);
	}
};
