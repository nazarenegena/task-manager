<script lang="ts">
	import type { viewType } from '../types/viewTypes';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import ListTodo from '@lucide/svelte/icons/list-todo';
	import CalendarCheck2 from '@lucide/svelte/icons/calendar-check-2';
	import ViewCard from './elements/viewCard.svelte';
	import Dashboard from './sections/dashboard.svelte';
	import TaskView from './sections/taskView.svelte';
	import Calender from './sections/calender.svelte';

	let activeView = $state<viewType>('dashboard');
	const views: { id: viewType; label: string; icon: Component<any> }[] = [
		{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
		{ id: 'tasks', label: 'Tasks', icon: ListTodo },
		{ id: 'calender', label: 'Calender', icon: CalendarCheck2 }
	];
</script>

<header class="space-y-4">
	<h1 class="text-5xl font-bold">Task Master</h1>
	<h3 class="text-xl text-primary/60">Stay Organized,Track your progress</h3>
</header>

<main class="py-10">
	<div class="mb-6 flex justify-around rounded-xl bg-primary/5 p-3">
		{#each views as view (view.id)}
			<ViewCard
				icon={view.icon}
				onclick={() => (activeView = view?.id)}
				viewCardTitle={view.label}
				className={activeView === view.id ? 'rounded-xl bg-secondary shadow-md text-primary' : ''}
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
