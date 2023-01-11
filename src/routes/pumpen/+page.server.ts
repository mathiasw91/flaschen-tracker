import type { Actions, PageServerLoad } from './$types';
import db from '$lib/db';

interface ItemFromDB {
  id: number;
  uhrzeit: string;
  datum: string;
  links: number;
  rechts: number;
}

type Item = ItemFromDB & {gesamt: number};

interface Day {
  datum: string;
  items: Item[];
  summe: number;
}

function _groupItems(items: Item[]) {
  const days: Day[] = [];
  items.forEach((item) => {
    const day = days.find((d) => d.datum === item.datum);
    if (!day) {
      days.push({
        datum: item.datum,
        items: [item],
        summe: item.gesamt
      });
    } else {
      day.items.push(item);
      day.summe += item.gesamt;
    }
  })
  return days;
}

export const load = (async () => {
  try {
    const flaschen = await db.collection<ItemFromDB>('pumpen').find().toArray();
    const items = flaschen.map(flasche => ({
      id: flasche.id,
      uhrzeit: flasche.uhrzeit,
      datum: flasche.datum,
      links: flasche.links,
      rechts: flasche.rechts,
      gesamt: flasche.links + flasche.rechts,
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
      await db.collection<ItemFromDB>('pumpen').insertOne({
        id: Date.now(),
        uhrzeit: data.get('uhrzeit')?.toString() || '00:00',
        datum: data.get('datum')?.toString() || new Date().toISOString().slice(0, 10),
        links: Number(data.get('links')?.toString()) || 0,
        rechts: Number(data.get('rechts')?.toString()) || 0,
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
      await db.collection<ItemFromDB>('pumpen').deleteOne({ id });
      return { success: true };
    } catch (err) {
      throw new Error();
    }
  }
};
