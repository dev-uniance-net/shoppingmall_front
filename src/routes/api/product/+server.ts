import { json } from '@sveltejs/kit';

export async function POST(event) {
	try {
		const { id, count, address, phone, totalPrice } = await event.request.json();

		const session = await event.locals.getSession();
		const profile = await event.locals.supabase
			.from('profiles')
			.select('*')
			.eq('id', session?.user.id);

		const product = await event.locals.supabase.from('products').select('*').eq('id', id);

		if (product.data!.length > 0 && profile.data!.length > 0) {
			if (product.data![0].remain_count < count) {
				return json({ success: false, message: '상품수량이 부족합니다.' });
			}
			const token = profile.data![0].token;
			// const sellerWallet = 'MTAxHovc7YutbWjRyVbCL9PCf8o8GdyZ2fbd80bd';
			const b = JSON.stringify({
				point: totalPrice.toString()
			});
			// console.log(b);
			// console.log(token);

			const res = await fetch(
				`http://api.28hospital.com/reservation/point/${profile.data![0].uid}/payment`,
				{
					method: 'POST',
					body: b,
					headers: {
						'Content-type': 'application/json',
						Authentication: token
					}
				}
			);
			const r = await res.json();
			console.log(r);
			if (r.code === 200) {
				await event.locals.supabase.from('history').insert([
					{
						product: id,
						sell_count: count,
						destination: address,
						phone,
						price: totalPrice,
						buyer: session?.user.id
					}
				]);
				console.log(':-----');
				console.log(product.data![0].remain_count);
				console.log(count);
				console.log(product.data![0].remain_count - count);
				const { error } = await event.locals.supabase
					.from('products')
					.update({ remain_count: product.data![0].remain_count - count })
					.eq('id', id);
				console.log(error);

				if (!error) {
					console.log('SUCCESa');
					return json({ success: true });
				}

				return json({ success: false });
			}
			return json({ success: false, message: r.message_kr });
		}
	} catch (error) {
		return json({ success: false });
	}

	// it's common to return JSON, so SvelteKit has a helper
	return json({ success: true });
}
