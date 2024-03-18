import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, data }) => {
	await parent();
	let { product } = data;

	return {
		product:
			product != null && product.data != null && product.data.length > 0 ? product.data[0] : []
	};
};
