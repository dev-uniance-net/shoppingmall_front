<script lang="ts">
	import Swal from 'sweetalert2';

	export let product: {
		id: number;
		images: string[];
		title: string;
		price: number;
		thumb: string[];
	} = {
		id: 0,
		images: [],
		title: '',
		price: 0,
		thumb: []
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
	async function cartAdd(e: any) {
		e.preventDefault();
		const r = await fetch('/api/cart?id=' + product.id, {
			method: 'GET',
			headers: { 'Content-type': 'application/json' }
		});
		const re = await r.json();
		if (re.success) return showAlert(re.message);
		return showAlert('장바구니 등록에 실패했습니다.');
	}
</script>

<div class="border">
	<a class="" href="/product/{product['id']}">
		<div class="relative">
			<img
				src={JSON.parse(product['thumb'][0]).url}
				class="w-full h-56 object-cover bg-black"
				alt="Post"
			/>
			<div class="absolute bottom-2 right-2">
				<button
					on:click={cartAdd}
					class="border border-redOrange flex items-center justify-center p-1 w-full card-hover bg-transparent"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 18 18"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						><path
							d="M1.53516 2.70001H3.93316L5.76816 10.609H13.6482L15.2992 4.35901H4.86916M12.8582 14.933C13.0098 14.9375 13.1609 14.9115 13.3024 14.8566C13.4438 14.8017 13.5728 14.7189 13.6817 14.6132C13.7906 14.5075 13.8771 14.381 13.9363 14.2412C13.9954 14.1015 14.0258 13.9513 14.0258 13.7995C14.0258 13.6478 13.9954 13.4975 13.9363 13.3578C13.8771 13.218 13.7906 13.0915 13.6817 12.9858C13.5728 12.8801 13.4438 12.7974 13.3024 12.7424C13.1609 12.6875 13.0098 12.6615 12.8582 12.666C12.5634 12.6748 12.2836 12.798 12.0782 13.0096C11.8727 13.2213 11.7578 13.5046 11.7578 13.7995C11.7578 14.0944 11.8727 14.3778 12.0782 14.5894C12.2836 14.801 12.5634 14.9243 12.8582 14.933ZM6.49316 14.933C6.64484 14.9375 6.79589 14.9115 6.93735 14.8566C7.07881 14.8017 7.20781 14.7189 7.31669 14.6132C7.42558 14.5075 7.51214 14.381 7.57126 14.2412C7.63037 14.1015 7.66083 13.9513 7.66083 13.7995C7.66083 13.6478 7.63037 13.4975 7.57126 13.3578C7.51214 13.218 7.42558 13.0915 7.31669 12.9858C7.20781 12.8801 7.07881 12.7974 6.93735 12.7424C6.79589 12.6875 6.64484 12.6615 6.49316 12.666C6.19836 12.6748 5.91858 12.798 5.71315 13.0096C5.50773 13.2213 5.39283 13.5046 5.39283 13.7995C5.39283 14.0944 5.50773 14.3778 5.71315 14.5894C5.91858 14.801 6.19836 14.9243 6.49316 14.933Z"
							stroke="#FF5733"
							stroke-width="1.6"
							stroke-linecap="square"
							stroke-linejoin="round"
						/></svg
					>
				</button>
			</div>
		</div>

		<div class="flex flex-col justify-between h-24 p-1">
			<div class="h-full line-clamp-2 text-sm lg:text-[15px]">
				{product['title']}
			</div>

			<div
				class="border flex items-center justify-center p-1 bg-redOrange text-white w-full card-hover"
			>
				<span class="text-sm font-bold">{product['price']} 포인트</span>
			</div>
		</div>
	</a>
</div>
