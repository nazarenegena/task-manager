<script lang="ts">
	import type { viewType } from '../types/viewTypes';
	import ViewCard from './elements/viewCard.svelte';
	import Dashboard from './sections/dashboard.svelte';
	import TaskView from './sections/taskView.svelte';
	import Calender from './sections/calender.svelte';

	let activeView = $state<viewType>('dashboard');
	const views: { id: viewType; label: string }[] = [
		{ id: 'dashboard', label: 'Dashboard' },
		{ id: 'tasks', label: 'Tasks' },
		{ id: 'calender', label: 'Calender' }
	];
</script>

<header class="space-y-4">
	<h1 class="text-5xl font-bold">Task Master</h1>
	<h3 class="text-xl text-zinc-500">Stay Organized,Track your progress</h3>
</header>

<main class="py-10">
	<div class="mb-6 flex w-84 justify-around rounded-lg bg-zinc-300/30 px-3 py-2">
		{#each views as view (view.id)}
			<ViewCard
				onclick={() => (activeView = view?.id)}
				viewCardTitle={view.label}
				className={activeView === view.id ? 'rounded-lg bg-white px-3 py-1 shadow-md' : ''}
			/>
		{/each}
	</div>
	<div>
		{#if activeView === 'dashboard'}
			<Dashboard />
		{:else if activeView === 'calender'}
			<Calender />
		{:else}
			<TaskView />
		{/if}
	</div>
</main>
