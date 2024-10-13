<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	let showTeamPopUp = false;
	let showCreateTeamPopUp = false;
	let showTeamDetails = false;
	let teamName = '';
	let teamColor = '#3B82F6';
	let inviteCode = '123456789';
	let inviteInput = '';

	interface Todo {
		id: string;
		text: string;
		completed: boolean;
	}

	interface Member {
		id: string;
		name: string;
	}

	interface Team {
		id: string;
		name: string;
		color: string;
		todos: Todo[];
		members: Member[];
	}

	let teams: Team[] = [
		{
			id: '1',
			name: 'Development',
			color: '#EF4444',
			todos: [
				{ id: '1', text: 'Implement new feature', completed: false },
				{ id: '2', text: 'Fix bug in login', completed: true }
			],
			members: [
				{ id: '1', name: 'Alice' },
				{ id: '2', name: 'Bob' }
			]
		},
		{
			id: '2',
			name: 'Design',
			color: '#10B981',
			todos: [
				{ id: '3', text: 'Create new logo', completed: false },
				{ id: '4', text: 'Design landing page', completed: false }
			],
			members: [
				{ id: '3', name: 'Charlie' },
				{ id: '4', name: 'Diana' }
			]
		}
	];

	let selectedTeam: Team | null = null;

	function toggleTeamPopup() {
		showTeamPopUp = !showTeamPopUp;
		if (!showTeamPopUp) {
			showTeamDetails = false;
			selectedTeam = null;
		}
	}

	function toggleCreateTeamPopup() {
		showCreateTeamPopUp = !showCreateTeamPopUp;
	}

	function handleOutsideClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (target.classList.contains('popup-overlay')) {
			showTeamPopUp = false;
			showCreateTeamPopUp = false;
			showTeamDetails = false;
			selectedTeam = null;
		}
	}

	function createTeam() {
		if (teamName.trim()) {
			const newTeam: Team = {
				id: (teams.length + 1).toString(),
				name: teamName.trim(),
				color: teamColor,
				todos: [],
				members: []
			};
			teams = [...teams, newTeam];
			teamName = '';
			teamColor = '#3B82F6';
			toggleCreateTeamPopup();
		}
	}

	function copyInviteCode() {
		navigator.clipboard.writeText(inviteCode);
		alert('Invite code copied to clipboard!');
	}

	function showTeamDetailsView(team: Team) {
		selectedTeam = team;
		showTeamDetails = true;
	}

	function inviteMember() {
		if (inviteInput.trim() && selectedTeam) {
			const newMember: Member = {
				id: (selectedTeam.members.length + 1).toString(),
				name: inviteInput.trim()
			};
			selectedTeam.members = [...selectedTeam.members, newMember];
			inviteInput = '';
		}
	}

	function toggleTodo(todo: Todo) {
		if (selectedTeam) {
			selectedTeam.todos = selectedTeam.todos.map((t) =>
				t.id === todo.id ? { ...t, completed: !t.completed } : t
			);
		}
	}
</script>

{#if showTeamPopUp}
	<button
		class="popup-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
		on:click={handleOutsideClick}
		transition:fade
	>
		<button
			class="relative w-full max-w-4xl rounded-lg bg-white p-8 shadow-lg"
			on:click|stopPropagation
			transition:fly={{ y: 50, duration: 300 }}
		>
			{#if !showTeamDetails}
				<h2 class="mb-6 text-3xl font-bold text-gray-800">Teams</h2>

				<div class="mb-6">
					<h3 class="mb-2 text-lg font-semibold text-gray-700">Your Invite Code</h3>
					<div class="flex items-center space-x-2">
						<input
							type="text"
							readonly
							class="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							value={inviteCode}
						/>
						<button
							on:click={copyInviteCode}
							class="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							📋
						</button>
					</div>
				</div>

				<div class="mb-6">
					<button
						on:click={toggleCreateTeamPopup}
						class="w-full rounded-md bg-green-500 py-2 text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
					>
						Create a Team
					</button>
				</div>

				<div>
					<h3 class="mb-2 text-lg font-semibold text-gray-700">Your Teams</h3>
					<ul class="flex flex-col gap-y-2">
						{#each teams as team (team.id)}
							<button
								class="flex cursor-pointer items-center justify-between rounded-md border border-gray-200 p-3 transition-colors hover:bg-gray-50"
								style="border-left: 4px solid {team.color};"
								on:click={() => showTeamDetailsView(team)}
							>
								<span class="font-medium text-gray-800">{team.name}</span>
								<span class="text-sm text-gray-500">{team.members.length} members</span>
							</button>
						{/each}
					</ul>
				</div>
			{:else}
				<div class="flex h-full flex-col">
					<h2 class="mb-4 text-3xl font-bold text-gray-800" style="color: {selectedTeam?.color};">
						{selectedTeam?.name}
					</h2>

					<div class="mb-4">
						<input
							type="text"
							bind:value={inviteInput}
							placeholder="Enter email to invite"
							class="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button
							on:click={inviteMember}
							class="mt-2 w-full rounded-md bg-blue-500 py-2 text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							Invite Member
						</button>
					</div>

					<div class="flex flex-1 space-x-4">
						<div class="w-1/2">
							<h3 class="mb-2 text-lg font-semibold text-gray-700">Todos</h3>
							<ul class="space-y-2">
								{#each selectedTeam?.todos || [] as todo (todo.id)}
									<li class="flex items-center space-x-2">
										<input
											type="checkbox"
											checked={todo.completed}
											on:change={() => toggleTodo(todo)}
											class="form-checkbox h-5 w-5 text-blue-600"
										/>
										<span class={todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'}>
											{todo.text}
										</span>
									</li>
								{/each}
							</ul>
						</div>
						<div class="w-1/2">
							<h3 class="mb-2 text-lg font-semibold text-gray-700">Members</h3>
							<ul class="space-y-2">
								{#each selectedTeam?.members || [] as member (member.id)}
									<li class="flex items-center space-x-2">
										<span class="text-gray-800">{member.name}</span>
									</li>
								{/each}
							</ul>
						</div>
					</div>
				</div>
			{/if}

			<button
				on:click={toggleTeamPopup}
				class="absolute right-2 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
			>
				&times;
			</button>
		</button>
	</button>
{/if}

{#if showCreateTeamPopUp}
	<button
		class="popup-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
		on:click={handleOutsideClick}
		transition:fade
	>
		<button
			class="relative w-full max-w-md rounded-lg bg-white p-8 shadow-lg"
			on:click|stopPropagation
			transition:fly={{ y: 50, duration: 300 }}
		>
			<h2 class="mb-6 text-3xl font-bold text-gray-800">Create a New Team</h2>

			<form on:submit|preventDefault={createTeam} class="space-y-4">
				<div>
					<label for="teamName" class="block text-sm font-medium text-gray-700">Team Name</label>
					<input
						type="text"
						id="teamName"
						bind:value={teamName}
						required
						class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter team name"
					/>
				</div>

				<div>
					<label for="teamColor" class="block text-sm font-medium text-gray-700">Team Color</label>
					<div class="mt-1 flex items-center space-x-2">
						<input
							type="color"
							id="teamColor"
							bind:value={teamColor}
							class="h-8 w-8 rounded-md border border-gray-300 p-0"
						/>
						<span class="text-sm text-gray-500">{teamColor}</span>
					</div>
				</div>

				<div class="flex space-x-2">
					<button
						type="submit"
						class="flex-1 rounded-md bg-green-500 py-2 text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
					>
						Create Team
					</button>
					<button
						type="button"
						on:click={toggleCreateTeamPopup}
						class="flex-1 rounded-md bg-gray-200 py-2 text-gray-700 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
					>
						Cancel
					</button>
				</div>
			</form>

			<button
				on:click={toggleCreateTeamPopup}
				class="absolute right-2 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
			>
				&times;
			</button>
		</button>
	</button>
{/if}

<button
	on:click={toggleTeamPopup}
	class=" w-fit rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
>
	Teams
</button>
