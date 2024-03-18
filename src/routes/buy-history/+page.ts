import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, data }) => {
	await parent();
	let { histories } = data;

	return {
		histories: histories != null && histories.data != null ? histories.data : []
	};
};
