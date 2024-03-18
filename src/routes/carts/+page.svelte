<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { redirect } from '@sveltejs/kit';

	export let data;

	async function cartDelete(id: string) {
		console.log('CART DELETE');
		const r = await fetch('/api/cart?id=' + id, {
			method: 'DELETE',
			headers: { 'Content-type': 'application/json' }
		});
		const re = await r.json();
		if (re.success) {
			invalidateAll();
		}
	}
	console.log(data['histories']);
</script>

<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<div class="container h-full mx-auto items-center p-1">
	{#if data['histories'].length === 0}
		<div class="flex justify-center items-center h-3/4 text-lg">장바구니가 비어있습니다</div>
	{:else}
		<h1 class="flex justify-center text-lg font-bold my-4">장바구니</h1>
		{#each data['histories'] ?? [] as i}
			<a href={'/product/' + i['products']['id']}>
				<div class="flex border-b my-4">
					<div class="card card-hover mb-4 rounded-none bg-white">
						<img
							src={JSON.parse(i['products']['images'][0]).url}
							class="w-24 object-cover bg-black"
							alt="Post"
						/>
					</div>
					<div class="flex flex-col space-y ml-2 justify-between">
						<div>
							<div class="">{i['products']['title']}</div>
							<div class="text-lg font-bold">{i['products']['price']} 28</div>
						</div>
						<button
							on:click={(e) => {
								e.preventDefault();
								cartDelete(i['id']);
							}}
							class="border flex items-center justify-center card-hover text-sm w-24 mb-4"
						>
							삭제하기
						</button>
					</div>
				</div>
			</a>
		{/each}
	{/if}
</div>
