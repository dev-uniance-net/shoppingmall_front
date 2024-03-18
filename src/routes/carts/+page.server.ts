import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({
	url,
	params,

	locals: { supabase, getSession }
}) => {
	const session = await getSession();

	const histories = await supabase
		.from('carts')
		.select('*,  products (*)')
		.eq('profile', session?.user.id);
	return { histories };
};
