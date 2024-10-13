<script lang="ts">
	import Navbar from '$lib/components/navbar.svelte';
</script>

<div class="h-screen w-full">
	<div class="flex flex-col px-4 py-4">
		<div>
			<Navbar />
		</div>
		<div class="flex w-full flex-col md:flex-row">
			<!-- Left Column: Calendar -->
			<div class="mt-8 md:w-1/2">
				<div class="w-2/3"></div>
			</div>

			<!-- Right Column: Plant Section -->
			<div class="mt-4 flex w-full flex-col items-center md:mt-16 md:w-1/2">2</div>
		</div>
	</div>
</div>
