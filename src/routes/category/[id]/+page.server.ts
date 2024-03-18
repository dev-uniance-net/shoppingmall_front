import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({
	url,
	params,

	locals: { supabase, getSession }
}) => {
	const products = await supabase
		.from('products')
		.select('*')
		.eq('category', params['id'])
		.order('id', { ascending: false });

	return { products };
};
