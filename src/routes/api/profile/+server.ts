import { json } from '@sveltejs/kit';

export async function GET(event) {
	try {
		// const { id, count, address, phone, totalPrice } = await event.request.json();

		const session = await event.locals.getSession();
		const profile = await event.locals.supabase
			.from('profiles')
			.select('*')
			.eq('id', session?.user.id);

		if (profile.data!.length > 0) {
			const token = profile.data![0].token;

			const res = await fetch(`http://api.28hospital.com/reservation/point/history `, {
				method: 'GET',
				headers: {
					'Content-type': 'application/json',
					Authentication: token
				}
			});
			const r = await res.json();
			console.log(r);

			if (r.code === 200) {
				return json({ success: true, balance: r.data.balance, email: profile.data![0].email });
			}
		}
	} catch (error) {
		return json({ success: false });
	}

	// it's common to return JSON, so SvelteKit has a helper
	return json({ success: true });
}
