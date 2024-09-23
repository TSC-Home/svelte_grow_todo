<script lang="ts">
	export let type: string;
	export let growth: number;

	const plants: any = {
		tree: ['', '🌱', '🌿', '🌳'],
		flower: ['🌱', '🌼', '🌻'],
		cactus: ['🌱', '🌵', '🏜️']
	};

	$: plant = plants[type] || plants.tree;
	$: stage = Math.floor((growth / 100) * (plant.length - 1));
</script>

<div class="relative flex h-64 w-64 items-center justify-center">
	<div class="text-9xl">{plant[stage]}</div>
	<div class="absolute bottom-0 left-1/2 -translate-x-1/2 transform font-bold text-green-800">
		{growth.toFixed(1)}%
	</div>
</div>
