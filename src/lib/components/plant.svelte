<script lang="ts">
	export let selectedPlant = 'tree';
	export let plantGrowth = 10;

	const plants: any = {
		tree: ['🌱', '🌿', '🌳'],
		flower: ['🌱', '🌼', '🌻'],
		cactus: ['🌱', '🌵', '🏜️']
	};

	$: plant = plants[selectedPlant] || plants.tree;
	$: stage = Math.floor((plantGrowth / 100) * (plant.length - 1));

	const changePlant = (plant: string) => {
		selectedPlant = plant;
	};
</script>

<div class="flex flex-col items-center justify-center space-y-4">
	<div class="mb-4">
		<h3 class="mb-2 text-lg font-semibold text-green-700">Select your plant:</h3>
		<div class="flex space-x-2">
			{#each Object.keys(plants) as plant}
				<button
					on:click={() => changePlant(plant)}
					class={`rounded-md px-4 py-2 ${
						selectedPlant === plant
							? 'bg-green-500 text-white'
							: 'bg-green-100 text-green-800 hover:bg-green-200'
					}`}
				>
					{plant.charAt(0).toUpperCase() + plant.slice(1)}
				</button>
			{/each}
		</div>
	</div>

	<div class="relative flex h-64 w-64 items-center justify-center">
		<div class="text-9xl">{plant[stage]}</div>
		<div class="absolute bottom-0 left-1/2 -translate-x-1/2 transform font-bold text-green-800">
			{plantGrowth.toFixed(1)}%
		</div>
	</div>
</div>
