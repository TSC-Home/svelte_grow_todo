<script lang="ts">
	export let growth: number;
</script>

<div class="relative h-64 w-64">
	<svg viewBox="0 0 100 100" class="h-full w-full">
		<path
			d="M50 90 L50 70 Q30 60 30 40 Q30 10 50 10 Q70 10 70 40 Q70 60 50 70 Z"
			fill="none"
			stroke="#2F855A"
			stroke-width="4"
		/>
		<path
			d="M50 90 L50 70 Q30 60 30 40 Q30 10 50 10 Q70 10 70 40 Q70 60 50 70 Z"
			fill="#4CAF50"
			stroke="none"
			style="clip-path: inset({100 - growth}% 0 0 0);"
		/>
	</svg>
	<div class="absolute bottom-0 left-1/2 -translate-x-1/2 transform font-bold text-green-800">
		{growth}%
	</div>
</div>
