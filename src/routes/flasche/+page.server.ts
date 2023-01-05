import type { Actions, PageServerLoad } from './$types';
import fs from 'fs/promises';

const FILE_PATH = '/flasche.csv';

const parseCsv = async () => {
	process.chdir('../');
	const ls2 = await fs.readdir(process.cwd());
	console.log('ls2',ls2);
	return [];
	// const content = await fs.readFile(FILE_PATH, 'utf-8');
	// const rows_as_string = content.split('\n').filter((r) => r.length);
	// return rows_as_string.map((row) => {
	// 	const fields = row.split(';');
	// 	return {
	// 		id: Number(fields[0]),
	// 		uhrzeit: fields[1],
	// 		datum: fields[2],
	// 		getrunken: Number(fields[3]),
	// 		flascheninhalt: Number(fields[4])
	// 	};
	// });
};

export const load = (async () => {
	try {
		const rows = await parseCsv();
		return {
			items: rows.sort((a, b) => b.id - a.id)
		};
	} catch (err) {
		console.log(err);
		throw new Error();
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	add: async ({ request }) => {
		try {
			const data = await request.formData();
			const uhrzeit = data.get('uhrzeit');
			const datum = data.get('datum');
			const getrunken = data.get('getrunken');
			const flascheninhalt = data.get('flascheninhalt');
			const content = `${Date.now()};${uhrzeit};${datum};${getrunken};${flascheninhalt};\n`;
			await fs.writeFile(FILE_PATH, content, { flag: 'a' });
			return { success: true };
		} catch (err) {
			console.log(err);
			throw new Error();
		}
	},
	//delete würde man eher als Endpunkt über einen RequestHandler für die method POST lösen
	//doch dieser Ansatz hatte nicht funktioniert
	delete: async ({ request }) => {
		try {
			const data = await request.formData();
			const id = Number(data.get('id'));
			let rows = await parseCsv();
			rows = rows.filter((row) => row.id !== id);
			const content = rows.map(
				(row) => `${row.id};${row.uhrzeit};${row.datum};${row.getrunken};${row.flascheninhalt};\n`
			);
			console.log(content);
			await fs.writeFile(FILE_PATH, content, { flag: 'w' });
			return { success: true };
		} catch (err) {
			throw new Error();
		}
	}
};
