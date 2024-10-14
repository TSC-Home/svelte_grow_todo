<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<nav class="flex w-full items-center justify-between">
	<span class=" w-1/3 cursor-default text-4xl">🌱</span>
	<h1 class="hidden w-1/3 justify-center text-4xl font-bold text-green-800 md:flex">Grow Tasks</h1>
	<div class="flex justify-end gap-x-2 md:w-1/3">
		<button class=" w-fit rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600">
			Teams
		</button>
		<form method="POST" action="/auth/?/logout" use:enhance class="space-x-2">
			<button
				type="submit"
				class=" rounded-md bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
			>
				Logout
			</button>
		</form>

		<!--
			<button class="rounded-md bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600">
				Login / Register
			</button>
		-->
	</div>
</nav>
