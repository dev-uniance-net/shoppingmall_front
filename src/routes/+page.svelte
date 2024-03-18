<script lang="ts">
	// import type { PageServerData } from './$types';
	import ProductCard from '../components/productCard.svelte';

	//@ts-ignore
	import Carousel from 'svelte-carousel';
	import { browser } from '$app/environment';
	import AgreeComponent from '../components/agreeComponent.svelte';

	let carousel: any; // for calling methods of the carousel instance

	const handleNextClick = () => {
		carousel.goToNext();
	};
	let clickAgree = false;
	export let data;
	async function agreeUpdate(): Promise<void> {
		if (clickAgree) return;
		clickAgree = true;
		const r = await fetch('/api/profile/agree', {
			method: 'GET',
			headers: { 'Content-type': 'application/json' }
		});
		console.log(r);
		const re = await r.json();
		if (re.success) location.reload();
	}
</script>

<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<Carousel dots={false} arrows={false} swiping={true} autoplay bind:this={carousel}>
	{#each data['banners'] ?? [] as i}
		<div>
			<img alt="banner" class="w-full h-80 object-cover" src={JSON.parse(i.image)[0].url} />
		</div>
	{/each}
</Carousel>
<div class="flex justify-center mb-4 border-y border-gray-100 p-4">
	<section class="grid grid-cols-5 gap-4">
		{#each data['categories'] ?? [] as i}
			<a href={'/category/' + i.id}
				><div class="flex flex-col items-center">
					<img alt="category" class="w-10" src={JSON.parse(i.icon)[0].url} />
					<div class="text-center text-xs w-14">{i.title}</div>
				</div>
			</a>
		{/each}
	</section>
</div>

<div class="container mx-auto items-center p-2 pt-0">
	<section class="grid grid-cols-2 gap-3 mt-0">
		{#each data['products'] ?? [] as i}
			<ProductCard product={i} />
		{/each}
	</section>
</div>

{#if !data['agree']}
	<button class="absolute top-0 left-0 right-0 bg-black bg-opacity-90 z-10 h-32">
		<div class="p-6 bg-white h-screen overflow-scroll">
			<AgreeComponent />

			<button
				on:click={agreeUpdate}
				class="variant-filled-primary btn-md text-center h-10 items-center justify-center flex text-white font-bold w-full disabled:bg-gray-500 disabled:cursor-not-allowed"
			>
				동의하기
			</button>
		</div>
	</button>
{/if}
