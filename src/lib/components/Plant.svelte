<script lang="ts">
	export let type: string;
	export let growth: number;

	const plants: any = {
		tree: ['🌱', '🌿', '🌳'],
		flower: ['🌱', '🌼', '🌻'],
		cactus: ['🌱', '🌵', '🏜️']
	};

	$: plant = plants[type] || plants.tree;
	$: stage = Math.floor((growth / 100) * (plant.length - 1));
</script>

<div class="flex flex-col items-center justify-center">
	<div class="mt-4 text-9xl">{plant[stage]}</div>
	<span class="mt-8 font-bold text-green-800">
		{growth.toFixed(1)}%
	</span>
</div>
