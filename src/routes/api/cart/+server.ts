import { json } from '@sveltejs/kit';

export async function GET(event) {
	try {
		const id = event.url.searchParams.get('id');
		const session = await event.locals.getSession();

		const c = await event.locals.supabase
			.from('carts')
			.select('*')
			.eq('product', id)
			.eq('profile', session?.user.id);
		console.log(c.data?.length);
		if (c.data!.length > 0) {
			return json({ success: true, message: '이미 추가되었습니다.' });
		}
		const r = await event.locals.supabase.from('carts').insert([
			{
				product: id,
				profile: session?.user.id
			}
		]);
		console.log(r);
		return json({ success: true, message: '장바구니에 추가되었습니다.' });
	} catch (error) {
		return json({ success: false });
	}

	// it's common to return JSON, so SvelteKit has a helper
	return json({ success: true });
}
export async function DELETE(event) {
	try {
		console.log('Xxx');
		const id = event.url.searchParams.get('id');
		console.log(id);
		const { error } = await event.locals.supabase.from('carts').delete().eq('id', id);
		console.log(error);
		return json({ success: true, message: '장바구니에 추가되었습니다.' });
	} catch (error) {
		console.log(error);
		return json({ success: false });
	}
}
