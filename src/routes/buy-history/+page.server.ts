import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({
	url,
	params,

	locals: { supabase, getSession }
}) => {
	const session = await getSession();

	const histories = await supabase
		.from('history')
		.select('*,  products (*)')
		.order('created_at', { ascending: false })
		.eq('buyer', session?.user.id);
	return { histories };
};
