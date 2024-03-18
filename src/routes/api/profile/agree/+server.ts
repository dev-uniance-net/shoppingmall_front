import { json } from '@sveltejs/kit';

export async function GET(event) {
	try {
		// const { id, count, address, phone, totalPrice } = await event.request.json();

		const session = await event.locals.getSession();
		// console.log(session?.user.id);
		// console.log('----');
		const { error } = await event.locals.supabase
			.from('profiles')
			.update({ agree: true })
			.eq('id', session?.user.id);
		if (!error) {
			return json({ success: true });
		}
		console.log(error);
	} catch (error) {
		return json({ success: false });
	}

	// it's common to return JSON, so SvelteKit has a helper
	return json({ success: false });
}
