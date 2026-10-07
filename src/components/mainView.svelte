<script lang="ts">
	import type { Component } from 'svelte';
	import type { viewType } from '../types/viewTypes';
	import ListTodo from '@lucide/svelte/icons/list-todo';
	import CalendarCheck2 from '@lucide/svelte/icons/calendar-check-2';
	import ViewCard from './elements/viewCard.svelte';
	import TaskView from './sections/taskView.svelte';
	import Calendar from './sections/calendar.svelte';
	import { fade } from 'svelte/transition';
	import Plus from '@lucide/svelte/icons/plus';
	import { openNewTask } from '../utils/helper';


	let anchorDate = $state(new Date());

	let formWrap = $state<HTMLDivElement | null>(null);

	let activeView = $state<viewType>('calendar');
	const views: { id: viewType; label: string; icon: Component<any> }[] = [
		{ id: 'calendar', label: 'Calendar', icon: CalendarCheck2 },
			{ id: 'tasks', label: 'Tasks', icon: ListTodo }
	];
</script>

<div class="flex justify-between items-center">
<div class="space-y-1">
   	<h1 class="text-xl font-bold">Task Master</h1>
	<h3 class="text-primary/60 font-semibold">Stay Organized,Track your progress</h3>
</div>

    <button
onclick={() => openNewTask(anchorDate, formWrap)}
				class="flex cursor-pointer items-center gap-1.5 rounded-lg bg-lime-accent px-4 py-2 text-sm font-semibold text-primary shadow-sm transition-all hover:shadow-md active:scale-95"
			>
				<Plus class="h-4 w-4" />
				New Task
			</button>

</div>

<main class="py-10">
	<div class="mb-6 flex justify-around rounded-xl bg-primary/5 p-3">
		{#each views as view (view?.id)}
			<ViewCard
				icon={view.icon}
				onclick={() => (activeView = view?.id)}
				viewCardTitle={view.label}
				className={activeView === view?.id ? 'rounded-xl bg-secondary shadow-md text-primary' : ''}
			/>
		{/each}
	</div>
	<div>
		{#if activeView === 'calendar'}
			<div transition:fade={{ duration: 150 }}>
				<Calendar />
			</div>
		{:else}
			<div transition:fade={{ duration: 150 }}>
				<TaskView />
			</div>
		{/if}
	</div>
</main>
