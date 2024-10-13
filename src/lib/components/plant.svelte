<script lang="ts">
	let selectedPlant = 'tree';
	let growth = 1;

	const plants: any = {
		tree: ['🌱', '🌿', '🌳'],
		flower: ['🌱', '🌼', '🌻'],
		cactus: ['🌱', '🌵', '🏜️']
	};

	$: plant = plants[selectedPlant] || plants.tree;
	$: stage = Math.floor((growth / 100) * (plant.length - 1));

	const plantOptions = [
		{ id: 'tree', name: 'Tree' },
		{ id: 'flower', name: 'Flower' },
		{ id: 'cactus', name: 'Cactus' }
	];
</script>

<div class="flex flex-col items-center justify-center">
	<div class="mb-4">
		<h3 class="mb-2 text-lg font-semibold text-green-700">Select your plant:</h3>
		<div class="flex space-x-2">
			{#each plantOptions as plant}
				<button
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

	<div class="mt-4 text-9xl">{plant[stage]}</div>
	<span class="mt-8 font-bold text-green-800">
		{growth.toFixed(1)}%
	</span>
</div>
