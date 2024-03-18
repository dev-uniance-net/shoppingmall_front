<script lang="ts">
	export let data;
	import Swal from 'sweetalert2';

	function converTime(t: any) {
		return new Date(t).toLocaleDateString() + ' ' + new Date(t).toLocaleTimeString();
	}
	let destination = '';
	let phone = '';
	let isOpen = false;
	let selectData: any;
	const GetStateText = (key: string) => {
		if (key === 'ready') return '구매요청';
		if (key === 'wait') return '준비중';
		if (key === 'transfer') return '배송중';
		if (key === 'refund') return '구매취소-요청중';
		if (key === 'cancel') return '구매취소';
		if (key === 'success') return '구매확정';
	};
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
	const chageAddress = async () => {
		let d = selectData;
		if (!d) return;

		if (destination === '' || destination.length < 8) {
			return showAlert('배송지를 8자이상 입력하세요.');
		}
		if (!phone.match(/^010[0-9]{7,8}$/)) {
			return showAlert('연락처를 01000000000 형식으로 입력하세요.');
		}

		const id = d['id'];
		const r = await fetch('/api/history', {
			method: 'POST',
			body: JSON.stringify({ id: id, destination, phone }),
			headers: { 'Content-type': 'application/json' }
		});

		const re = await r.json();
		console.log(re);
		if (!re.success) return showAlert(re.message);

		destination = '';
		phone = '';
		showAlert('수정되었습니다.');
		window.location.reload();
	};
	const changeState = async (id: string, state: string) => {
		const r = await fetch('/api/product/state?id=' + id + '&state=' + state, {
			method: 'GET',
			headers: { 'Content-type': 'application/json' }
		});

		const re = await r.json();
		console.log(re);
		if (!re.success) return showAlert(re.message);

		showAlert('수정되었습니다.');
		window.location.reload();
	};
</script>

<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<div class="container h-full mx-auto items-center p-1">
	{#if data['histories'].length === 0}
		<div class="flex justify-center items-center h-3/4 text-lg">구매한 상품이 없습니다</div>
	{:else}
		{#each data['histories'] ?? [] as i}
			<div class="relative">
				<a href={i['products'] ? '/product/' + i['products']['id'] : '/buy-history'}>
					<div class="flex py-2">
						<div class="w-32 h-24 bg-white">
							<img
								src={i['products'] ? JSON.parse(i['products']['images'][0]).url : ''}
								class="w-24 h-24 object-cover"
								alt="Post"
							/>
						</div>
						<div class="flex flex-col space-y-2 ml-2 w-full justify-start">
							<div class="flex w-full justify-between items-center">
								<div class="text-xs mr-4 text-gray-500">{converTime(i['created_at'])}</div>
								<div class="text-xs bg-red-500 text-white text-center mr-4 px-2">
									{GetStateText(i['state'])}
								</div>
							</div>
							<div class="text-sm">{i['products'] ? i['products']['title'] : ''}</div>
							<div class="flex text-sm">
								<div class=" text-redOrange">{i['price']} 28</div>
								<div class="mx-2">&#183;</div>
								<div>{i['sell_count']}개</div>
							</div>
						</div>
					</div></a
				>
				<div class="w-full">
					<div class="flex flex-col text-sm">
						<div class="flex items-center">
							<span class="w-5 block mr-1 text-center">⛟</span>{' ' + i['destination']}
						</div>

						<div class="flex items-center">
							<span class="w-5 block mr-1 text-center">&#9742;</span>{' ' + i['phone']}
						</div>
					</div>
					<div class="flex top-24 border-b pb-4 w-full mt-2">
						{#if ['ready', 'wait'].includes(i['state'])}
							<button
								class="text-xs bg-gray-500 w-full py-2 text-white mr-2"
								on:click={() => {
									isOpen = true;
									selectData = i;
								}}
							>
								수정
							</button>
						{/if}
						{#if !['refund', 'cancel', 'success'].includes(i['state'])}
							<button
								class="text-xs bg-black w-full py-2 text-white mr-2"
								on:click={() => {
									setTimeout(() => {
										let check = confirm(
											'관리자 확인후 취소처리되며, 코인은 취소가 완료된이후,반환됩니다'
										);
										if (check) {
											changeState(i['id'], 'refund');
										}
									}, 400);
								}}
							>
								구매취소
							</button>
						{/if}
						{#if i['state'] === 'transfer'}
							<button
								class="text-xs bg-green-500 w-full text-white py-2"
								on:click={() => {
									changeState(i['id'], 'success');
								}}
							>
								구매확정
							</button>
						{/if}
					</div>
				</div>
			</div>
		{/each}
		{#if isOpen}
			<button class="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-90 z-10">
				<div class="relative flex justify-center">
					<div class="p-6 bg-white w-96">
						<label class="label my-6">
							<span>받는 주소</span>
							<input bind:value={destination} class="input" type="text" placeholder="받는 주소" />
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
								on:click={chageAddress}
								class="variant-filled-primary btn-md text-center h-10 items-center justify-center flex text-white font-bold w-full disabled:bg-gray-500 disabled:cursor-not-allowed"
							>
								수정하기
							</button>
						</div>
					</div>
				</div>
			</button>
		{/if}
	{/if}
</div>
