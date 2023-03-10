import type { Actions, PageServerLoad } from './$types';
import db from '$lib/db';

interface Item {
  id: number;
  uhrzeit: string;
  datum: string;
  getrunken: number;
  flascheninhalt: number;
}

interface Day {
  datum: string;
  items: Item[];
  getrunken: number;
}

function _groupItems(items: Item[]) {
  const days: Day[] = [];
  items.forEach((item) => {
    const day = days.find((d) => d.datum === item.datum);
    if (!day) {
      days.push({
        datum: item.datum,
        items: [item],
        getrunken: item.getrunken
      });
    } else {
      day.items.push(item);
      day.getrunken += item.getrunken;
    }
  })
  return days;
}

export const load = (async () => {
  try {
    const flaschen = await db.collection<Item>('flaschen').find().toArray();
    const items = flaschen.map(flasche => ({
      id: flasche.id,
      uhrzeit: flasche.uhrzeit,
      datum: flasche.datum,
      getrunken: flasche.getrunken,
      flascheninhalt: flasche.flascheninhalt,
    })).sort((a, b) => b.id - a.id)
    return {
      items: _groupItems(items),
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
      await db.collection<Item>('flaschen').insertOne({
        id: Date.now(),
        uhrzeit: data.get('uhrzeit')?.toString() || '00:00',
        datum: data.get('datum')?.toString() || new Date().toISOString().slice(0, 10),
        getrunken: Number(data.get('getrunken')?.toString()) || 0,
        flascheninhalt: Number(data.get('flascheninhalt')?.toString()) || 0,
      });
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
      const id = Number(data.get('id')?.toString());
      await db.collection<Item>('flaschen').deleteOne({ id });
      return { success: true };
    } catch (err) {
      throw new Error();
    }
  }
};
