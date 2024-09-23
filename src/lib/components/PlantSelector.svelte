<script lang="ts">
	export let selectedPlant: string;
	export let changePlant: (plant: string) => void;

	const plants = [
		{ id: 'tree', name: 'Tree' },
		{ id: 'flower', name: 'Flower' },
		{ id: 'cactus', name: 'Cactus' }
	];
</script>

<div class="mb-4">
	<h3 class="mb-2 text-lg font-semibold text-green-700">Select your plant:</h3>
	<div class="flex space-x-2">
		{#each plants as plant}
			<button
				on:click={() => changePlant(plant.id)}
				class={`rounded-md px-4 py-2 ${
					selectedPlant === plant.id
						? 'bg-green-500 text-white'
						: 'bg-green-100 text-green-800 hover:bg-green-200'
				}`}
			>
				{plant.name}
			</button>
		{/each}
	</div>
</div>
