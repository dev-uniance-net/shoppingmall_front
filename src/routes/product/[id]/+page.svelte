<script lang="ts">
	// @ignore ts

	import type { PageData } from './$types';
	import LoadingIndicator from '$src/components/loadingIndicator.svelte';
	import { invalidateAll } from '$app/navigation';
	import Swal from 'sweetalert2';
	export let data: PageData;
	if (typeof data === 'string') data = JSON.parse(data);
	let isOpen = false;
	let isBuying = false;
	// let closeModal = false;

	let thumnail = JSON.parse(data.product.thumb[0]).url;
	// console.log(JSONdata.product.thumb[0]);

	let count = 0;
	let price = +data['product']['price'];
	let totalPrice = 0;
	let address = '';
	let phone = '';
	let balance = -1;

	function countClick(i: number) {
		count += i;
		if (count > data['product']['remain_count']) count = data['product']['remain_count'];

		if (count < 0) count = 0;
		totalPrice = count * price;
	}
	function showAlert(msg: string) {
		setTimeout(() => {
			Swal.fire({
				title: '28몰',
				text: msg,
				confirmButtonText: '확인',
				confirmButtonColor: 'black'
			});
		}, 400);
	}
	const buy = async () => {
		if (isBuying) return;
		isBuying = true;
		if (count === 0) {
			isOpen = false;
			isBuying = false;
			return showAlert('0개 이상 구매하세요.');
		}
		if (address === '' || address.length < 8) {
			isBuying = false;
			return showAlert('배송지를 8자이상 입력하세요.');
		}
		if (!phone.match(/^010[0-9]{7,8}$/)) {
			isBuying = false;
			return showAlert('연락처를 01000000000 형식으로 입력하세요.');
		}

		if (count > data['product']['remain_count']) {
			isBuying = false;
			return showAlert('상품 수량이 부족합니다.');
		}
		const r = await fetch('/api/product', {
			method: 'POST',
			body: JSON.stringify({ id: data['product']['id'], count, address, phone, totalPrice }),
			headers: { 'Content-type': 'application/json' }
		});
		const re = await r.json();
		if (!re.success) {
			isBuying = false;
			return showAlert(re.message);
		}
		isOpen = false;
		totalPrice = 0;
		count = 0;
		address = '';
		phone = '';
		isBuying = false;

		showAlert('구매가 완료되었습니다.');
		setTimeout(() => {
			invalidateAll();
		}, 1000);
	};

	const loadPrice = async () => {
		const r = await fetch('/api/profile', {
			method: 'GET',
			headers: { 'Content-type': 'application/json' }
		});
		const re = await r.json();
		console.log(re);
		balance = re.balance;
	};

	document.body.scrollIntoView();
	loadPrice();
</script>

{#if balance == -1}
	<LoadingIndicator />
{:else}
	<div class="container mx-auto px-2">
		<div class="w-full">
			<img class="h-full w-full rounded-md object-cover max-w-lg mx-auto" src={thumnail} alt="" />
		</div>
		<div class="flex overflow-x-scroll">
			{#each data.product.thumb as i}
				<button class="cursor-pointer" on:click={() => (thumnail = JSON.parse(i).url)}>
					<img
						class="h-14 object-contain border border-black mr-2 mt-2"
						src={JSON.parse(i).url}
						alt=""
					/>
				</button>
			{/each}
		</div>
		<div class="w-full max-w-lg mx-auto mt-5">
			<h3 class="font-bold uppercase text-xl">{data['product']['title']}</h3>
			<span class="font-bold mt-3 text-2xl">{price.toLocaleString()} 포인트</span>
			<span class="font-bold mt-3 text-2xl">({data['product']['remain_count']}개)</span>
			<hr class="my-3" />
		</div>

		<div class="h-32 w-full bg-white">
			<div class="flex items-center justify-between">
				<div class="flex items-center mt-1">
					<button
						on:click={() => countClick(-1)}
						type="button"
						class="bg-black btn-sm text-white w-10 text-2xl">-</button
					>

					<span class="text-black text-2xl mx-4 w-11 text-center">{count}</span>
					<button
						on:click={() => countClick(1)}
						type="button"
						class="bg-black text-white btn-sm w-10 text-2xl">+</button
					>
				</div>
				<div class="w-32 text-right">
					<span class="text-sm">총 상품금액</span>
					<div class="text-xl font-bold">{totalPrice.toLocaleString()} 포인트</div>
				</div>
			</div>

			{#if isOpen}
				<button class="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-90 z-10">
					<div class="relative flex justify-center">
						<div class="p-6 bg-white w-96">
							<label class="label my-6">
								<span>받는 주소</span>
								<input bind:value={address} class="input" type="text" placeholder="받는 주소" />
							</label>
							<label class="label">
								<span>연락처</span>

								<input
									bind:value={phone}
									required
									class="input"
									type="tel"
									pattern={'010[0-9]{7,8}'}
									placeholder="연락처 (01000000000)"
								/>
							</label>
							<div class="flex mt-8">
								<button
									on:click={() => (isOpen = false)}
									class="variant-filled-surface btn-md text-center h-10 items-center justify-center flex text-white font-bold w-32 mr-4"
								>
									닫기
								</button>
								<button
									disabled={balance < totalPrice || totalPrice === 0}
									on:click={buy}
									class="variant-filled-primary btn-md text-center h-10 items-center justify-center flex text-white font-bold w-full disabled:bg-gray-500 disabled:cursor-not-allowed"
								>
									구매하기
								</button>
							</div>
						</div>
					</div>
				</button>
			{/if}
			<button
				disabled={balance < totalPrice || totalPrice === 0}
				on:click={() => {
					isOpen = true;
				}}
				class="variant-filled-primary btn-md text-center h-14 items-center justify-center flex text-white font-bold w-full mt-4 disabled:bg-gray-500 disabled:cursor-not-allowed"
			>
				{data.product.remain_count === 0 ? 'SOLD OUT' : '구매하기'}
			</button>
		</div>
		<div class="border-t">
			{#each data.product.images as i}
				<img
					class="w-full object-contain border border-black mr-2 mt-2"
					src={JSON.parse(i).url}
					alt=""
				/>
			{/each}
		</div>
		<div class="text-lg mt-8 border-t py-4">{@html data['product']['descriptor']}</div>
	</div>
{/if}
