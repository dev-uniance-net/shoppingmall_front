import { json } from '@sveltejs/kit';

export async function GET(event) {
	try {
		const id = event.url.searchParams.get('id');
		const state = event.url.searchParams.get('state');
		const { error } = await event.locals.supabase.from('history').update({ state }).eq('id', id);

		if (!error) {
			return json({ success: true });
		}
	} catch (error) {
		return json({ success: false });
	}

	console.log('SUCCESS');
	// it's common to return JSON, so SvelteKit has a helper
	return json({ success: false });
}
