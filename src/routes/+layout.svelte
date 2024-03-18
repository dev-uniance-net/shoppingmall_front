<script lang="ts">
	import '../app.postcss';
	import {
		AppShell,
		AppBar,
		Drawer,
		type DrawerSettings,
		getDrawerStore
	} from '@skeletonlabs/skeleton';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import { goto, invalidateAll } from '$app/navigation';
	import { navigating, page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageLoad } from './$types.js';

	export let data;

	const { supabase, session } = data;
	let loading = true;
	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
			if (session) {
				loading = false;
			}
		});
		// console.log('PAGE LOADED');

		return () => data.subscription.unsubscribe();
	});

	initializeStores();
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	const drawerStore = getDrawerStore();

	const drawerSettings: DrawerSettings = {
		id: 'example-3',
		bgDrawer: 'bg-white text-white',
		width: 'w-[280px]',
		rounded: 'rounded-none',
		position: 'right'
	};
	let email = '로딩중';
	let point = 0;
	let drawClick = false;
	async function drawerOpen(): Promise<void> {
		if (drawClick) return;
		drawClick = true;
		const r = await fetch('/api/profile', {
			method: 'GET',
			headers: { 'Content-type': 'application/json' }
		});
		const re = await r.json();

		if (re.success) {
			email = re.email;
			point = re.balance;
		}
		drawerStore.open(drawerSettings);
		drawClick = false;
	}

	function clickMenu(url: string): void {
		if (url.includes('shop') || url.includes('buy-history')) {
			// alert('kkk');
		}
		drawerStore.close();
		goto(url);
	}
	function clickPhone(number: string) {
		// alert(msg);

		// @ts-ignore
		AndroidInterface.dialPhoneNumber(number);
	}

	function clickEmail() {
		// @ts-ignore
		AndroidInterface.sendEmail('beelze00@naver.com', 'Cozy Shopping Mall');
	}
</script>

<!-- App Shell -->
<div class="h-full max-w-lg mx-auto bg-white">
	{#if loading}
		<div class="h-full w-full flex flex-col items-center justify-center">
			<h1 class="text-6xl">
				<span
					class="bg-gradient-to-br from-red-500 to-redOrange bg-clip-text text-transparent box-decoration-clone"
					>28.</span
				>
			</h1>
			<h1 class="text-6xl font-bold">
				<span
					class="bg-gradient-to-br from-blue-800 to-redOrange bg-clip-text text-transparent box-decoration-clone"
					>쇼핑몰
				</span>
			</h1>
			<h1 class="text-2xl font-bold mt-6">
				<span class="text-black">로그인중...</span>
			</h1>
			<div role="status" class="mt-10">
				<svg
					aria-hidden="true"
					class="w-32 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-redOrange"
					viewBox="0 0 100 101"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
						fill="currentColor"
					/>
					<path
						d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
						fill="currentFill"
					/>
				</svg>
			</div>
		</div>
	{:else}
		<Drawer>
			<div class="text-black">
				<div class="font-bold text-2xl text-center my-4">28</div>
				<div class="btn mr-2 bg-white text-black flex border w-full rounded-none border-b-0">
					{email}
				</div>
				<div class=" btn mr-2 bg-white text-black flex border w-full rounded-none border-b-0">
					{point} 포인트
				</div>
				<button
					on:click={() => {
						clickMenu('/carts');
					}}
					class=" btn mr-2 bg-white text-black flex border w-full rounded-none border-b-0"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="w-5 object-cover mr-2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
						/>
					</svg>

					장바구니
				</button>

				<button
					on:click={() => {
						clickMenu('/buy-history');
					}}
					class=" btn mr-2 bg-white text-black flex border w-full rounded-none"
				>
					<!-- <a class="btn btn-sm variant-filled-error text-xs" href="/shop"> -->
					<img alt="shop" src="/receipt.png" class="w-6 object-cover mr-2" />

					구매내역
				</button>
				<button
					on:click={() => {
						clickMenu('/agree');
					}}
					class=" btn mr-2 bg-white text-black flex border w-full rounded-none"
				>
					<!-- <a class="btn btn-sm variant-filled-error text-xs" href="/shop"> -->

					이용약관
				</button>
				<div class="flex flex-col items-center mt-4 text-gray-600 border-b pb-4">
					<div>CS담당?</div>
					<div>
						<button on:click={() => clickPhone('01000000000')} class="text-blue-600">
							010-????-????
						</button>
					</div>
					<div>
						<button class="text-blue-600" on:click={clickEmail}> ?????@naver.com </button>
					</div>
				</div>
			</div>

			<div />
		</Drawer>

		<AppShell>
			<svelte:fragment slot="header">
				<div class=" text-white">
					<AppBar
						padding="py-3"
						gridColumns="grid-cols-3"
						slotDefault="place-self-center"
						slotTrail="place-content-end"
						background="bg-white text-black border-b border-black"
					>
						<svelte:fragment slot="lead"
							>{#if $page.url.pathname !== '/'}
								<button
									on:click={() => {
										window.history.back();
									}}
								>
									<img class="h-6 ml-3" src="/backb.png" alt="" />
								</button>
							{/if}
						</svelte:fragment>
						<div class="font-bold text-2xl">
							{#if $page.url.pathname !== '/'}
								<a href="/">28</a>
							{:else}
								<button
									on:click={() => {
										invalidateAll();
									}}>28</button
								>
							{/if}
						</div>
						<svelte:fragment slot="trail"
							><button on:click={drawerOpen} class="btn btn-sm mr-4">
								<span>
									<svg viewBox="0 0 100 80" class="h-4 fill-black">
										<rect width="100" height="20" />
										<rect y="30" width="100" height="20" />
										<rect y="60" width="100" height="20" />
									</svg>
								</span>
							</button></svelte:fragment
						>
					</AppBar>
					<!-- <AppBar background="variant-filled-primary">
					<svelte:fragment slot="lead">
						<strong class="text-xl uppercase">
							{#if $page.url.pathname === '/'}
								COZY
							{:else}
								<a class="flex" href="/">
									<img class="h-7 mr-0" src="/backw.png" alt="" />
									COZY
								</a>
							{/if}
						</strong></svelte:fragment
					>
					<svelte:fragment slot="trail">
						<button on:click={drawerOpen} class="btn btn-sm mr-4 bg-white">
							<span>
								<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
									<rect width="100" height="20" />
									<rect y="30" width="100" height="20" />
									<rect y="60" width="100" height="20" />
								</svg>
							</span>
						</button>
					</svelte:fragment>
				</AppBar> -->
				</div>
			</svelte:fragment>

			<slot />
		</AppShell>
	{/if}
</div>
