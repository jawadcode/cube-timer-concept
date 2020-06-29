import { openDB, deleteDB, wrap, unwrap } from 'https://unpkg.com/idb?module';

export function initSolvesDB() {
	openDB('solves', 1, {
		upgrade(db) {
			db.createObjectStore('2x2', { keyPath: 'id', autoIncrement: true });
			db.createObjectStore('3x3', { keyPath: 'id', autoIncrement: true });
			db.createObjectStore('4x4', { keyPath: 'id', autoIncrement: true });
			db.createObjectStore('5x5', { keyPath: 'id', autoIncrement: true });
			db.createObjectStore('6x6', { keyPath: 'id', autoIncrement: true });
			db.createObjectStore('7x7', { keyPath: 'id', autoIncrement: true });
			db.createObjectStore('Pyraminx', { keyPath: 'id', autoIncrement: true });
			db.createObjectStore('Skewb', { keyPath: 'id', autoIncrement: true });
			db.createObjectStore('Megaminx', { keyPath: 'id', autoIncrement: true });
			db.createObjectStore('Square-1', { keyPath: 'id', autoIncrement: true });
			db.createObjectStore('Clock', { keyPath: 'id', autoIncrement: true });
		},
	});
}

export async function addSolve(puzzle, solve) {
	let db1 = await openDB('solves', 1);
	db1.add(puzzle, solve);
	db1.close();
}

export async function getSolves(puzzle) {
	let db1 = await openDB('solves', 1);
	let values = await db1.getAll(puzzle);
	return values;
}