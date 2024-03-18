import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { supabase, getSession, token } }) => {
	const session = await getSession();

	const checkWallet = async (email: string, key: string) => {
		const profiles = await supabase.from('profiles').select('*').eq('email', email);
		if (profiles.data![0]) {
			// if (profiles.data![0].wallet === null) {
			// 	const res = await fetch(`http://api.28hospital.com/wallets/39/address`, {
			// 		method: 'POST',
			// 		headers: {
			// 			Authentication: key,
			// 			'Content-type': 'application/json'
			// 		}
			// 	});
			// 	const item = await res.json();

			// 	await supabase
			// 		.from('profiles')
			// 		.update({ wallet: item.data.address })
			// 		.eq('id', session?.user.id);
			// }
			console.log(profiles.data![0].agree);
			return profiles.data![0].agree;
		}
		return true;
	};

	let key = url.searchParams.get('k');

	let agree = false;
	if (key && key.length > 10) {
		const res = await fetch(`http://api.28hospital.com/account/authenticated`, {
			headers: {
				Authentication: key
			}
		});
		const item = await res.json();
		console.log(item);
		console.log('Xxx');
		if (item.code === 200) {
			let userEmail = item.data.uid + '@28.com';

			token = key;

			if (userEmail === session?.user.email) {
				const { error } = await supabase
					.from('profiles')
					.update({ token: key })
					.eq('id', session?.user.id);
				agree = await checkWallet(userEmail, key);
				const categories = await supabase
					.from('categories')
					.select('*')
					.order('num', { ascending: true });
				const extractedData = categories.data?.map((item) => ({
					home_order: item.home_order,
					id: item.id
				}));

				const homeOrder = extractedData?.sort((a: any, b: any) => {
					return a.home_order - b.home_order;
				});

				let products = await supabase
					.from('products')
					.select('*')
					.order('id', { ascending: false });

				if (products.data) {
					const sortOrder = homeOrder?.map((i) => i.id) ?? [];

					products.data.sort((a, b) => {
						return sortOrder.indexOf(a.category) - sortOrder.indexOf(b.category);
					});
				}
				const banners = await supabase
					.from('banners')
					.select('*')
					.order('created_at', { ascending: false });

				return { products, banners, categories, agree };
			}

			const profile = await supabase.from('profiles').select('*').eq('email', userEmail);

			if (profile.data!.length === 0) {
				const re = await supabase.auth.signUp({
					email: userEmail,
					password: item.data.uid,
					options: {
						data: {
							email: userEmail,
							nick: item.data.name,
							token: key,
							uid: item.data.uid
						}
					}
				});
				console.log(re);
				agree = await checkWallet(userEmail, key);
			} else {
				await supabase.auth.signInWithPassword({
					email: userEmail,
					password: item.data.uid
				});

				await supabase.from('profiles').update({ token: key }).eq('id', profile.data![0].id);
				agree = await checkWallet(userEmail, key);
			}
		}
	} else {
		if (session && session?.user.email) {
			agree = await checkWallet(session?.user.email, token);
		}
	}

	let products = await supabase.from('products').select('*').order('id', { ascending: false });

	const categories = await supabase
		.from('categories')
		.select('*')
		.order('num', { ascending: true });

	const extractedData = categories.data?.map((item: any) => ({
		home_order: item.home_order,
		id: item.id
	}));

	const homeOrder = extractedData?.sort((a: any, b: any) => {
		return a.home_order - b.home_order;
	});

	if (products.data) {
		const sortOrder = homeOrder?.map((i) => i.id) ?? [];

		products.data.sort((a, b) => {
			return sortOrder.indexOf(a.category) - sortOrder.indexOf(b.category);
		});
	}

	const banners = await supabase
		.from('banners')
		.select('*')
		.order('created_at', { ascending: false });

	return { products, banners, categories, agree };
};
