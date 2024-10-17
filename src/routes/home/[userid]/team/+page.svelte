<script>
	import Navbar from '$lib/components/navbar.svelte';
</script>

<div class="h-screen w-full">
	<div class="flex flex-col px-4 py-4">
		<div>
			<Navbar />
		</div>
		<div class="mt-8 flex justify-center">
			<div class="w-full 2xl:w-1/2">
				<div class="flex flex-col items-center justify-between lg:flex-row">
					<div class="w-full lg:w-1/2"></div>
					<div class="mb-4 w-fit"></div>
				</div>
			</div>
		</div>

		<div class="flex w-full justify-center">
			<div class="w-full 2xl:w-1/2">
				<div class="lg:w-1/2"></div>
			</div>
		</div>
	</div>
</div>

<style>
	:root {
		background-color: #dcfce7;
	}
</style>
