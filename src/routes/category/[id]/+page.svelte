<script lang="ts">
	// import type { PageServerData } from './$types';

	//@ts-ignore
	import Carousel from 'svelte-carousel';
	import { browser } from '$app/environment';
	import ProductCard from '../../../components/productCard.svelte';

	let carousel: any; // for calling methods of the carousel instance

	const handleNextClick = () => {
		carousel.goToNext();
	};
	export let data;
	console.log(data);
</script>

<div class="container h-full mx-auto items-center p-2">
	<section class="grid grid-cols-2 gap-3 mt-2">
		{#each data['products'] ?? [] as i}
			<ProductCard product={i} />
		{/each}
	</section>
</div>
