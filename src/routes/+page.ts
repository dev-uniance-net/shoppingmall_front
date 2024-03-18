import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, data }) => {
	await parent();
	// return data;
	let { products, banners, categories, agree } = data;

	return {
		agree: agree != null ? agree : false,
		products: products != null ? products.data : [],
		banners: banners != null ? banners.data : [],
		categories: categories != null ? categories.data : []
	};
};
