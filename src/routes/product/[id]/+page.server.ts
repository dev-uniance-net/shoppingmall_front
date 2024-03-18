import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({
	url,
	params,

	locals: { supabase, getSession }
}) => {
	const product = await supabase.from('products').select('*').eq('id', params['id']);

	return { product };
};
