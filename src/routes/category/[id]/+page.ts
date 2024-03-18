import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, data }) => {
	await parent();
	// return data;
	let { products } = data;

	return {
		products: products != null ? products.data : []
	};
};
