import { json } from '@sveltejs/kit';

export async function POST(event) {
	try {
		const { id, destination, phone } = await event.request.json();

		const res = await event.locals.supabase
			.from('history')
			.update({ destination, phone })
			.eq('id', id);
		console.log(res);
		// const r = await res.json();
		// console.log(r);
		// if (r.code === 200) {
		return json({ success: true });
		// }
		// return json({ success: false, message: r.message_kr });
	} catch (error) {
		return json({ success: false });
	}

	// it's common to return JSON, so SvelteKit has a helper
	return json({ success: true });
}
