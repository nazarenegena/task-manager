<script lang="ts">
	import { taskStore } from '$lib/taskStore.svelte';
	import StatusCard from '../elements/statusCard.svelte';
	import ListFilter from '@lucide/svelte/icons/list-filter';
	import ListTodo from '@lucide/svelte/icons/list-todo';
	import TaskCard from '../elements/taskCard.svelte';

	let filterStatus = $state<'all' | 'completed' | 'inprogress' | 'pending'>('all');

	let filteredTasks = $derived(
		filterStatus === 'all'
			? taskStore.tasks
			: filterStatus === 'pending'
				? taskStore.tasks.filter((t) => t.status !== 'completed')
				: taskStore.tasks.filter((t) => t.status === filterStatus)
	);
</script>

<div class=" flex items-center space-x-4">
	<ListTodo class="text h-10 w-10 rounded-lg bg-lime-accent/15 p-2 text-lime-accent" />
	<div>
		<h1 class="text-2xl font-bold">All Tasks</h1>
		<h3 class="text-primary/60">Filter and manage your tasks</h3>
	</div>
</div>
<main class="my-10">
	<div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
		<StatusCard statusTitle="Total Tasks" taskCount={taskStore.tasks.length} />
		<StatusCard statusTitle="Pending Tasks" taskCount={taskStore.pendingTasks} status="pending" />

		<StatusCard statusTitle="Completed" taskCount={taskStore.completedTasks} status="completed" />

		<StatusCard
			statusTitle="Inprogress"
			taskCount={taskStore.inprogressTasks}
			status="inprogress"
		/>
		<StatusCard
			statusTitle="High Priority"
			taskCount={taskStore.highPriorityTasks}
			priority="high"
		/>
	</div>
	<div class="my-6 rounded-xl border border-primary/15 p-5 shadow-sm">
		<div class="mb-4 flex items-center gap-2">
			<ListFilter class="h-5 w-5 text-primary/60" />
			<span class="text-sm font-semibold text-primary/70">Filters</span>
		</div>
		<div class="flex flex-wrap gap-2">
			<button
				onclick={() => (filterStatus = 'all')}
				class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors {filterStatus === 'all'
					? 'bg-primary text-secondary shadow-sm'
					: 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'}"
			>
				All ({taskStore.tasks.length})
			</button>
			<button
				onclick={() => (filterStatus = 'pending')}
				class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors {filterStatus === 'pending'
					? 'bg-amber-500 text-white shadow-sm'
					: 'bg-amber-50 text-amber-600 hover:bg-amber-100'}"
			>
				Pending ({taskStore.pendingTasks})
			</button>
			<button
				onclick={() => (filterStatus = 'inprogress')}
				class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors {filterStatus === 'inprogress'
					? 'bg-purple-accent text-white shadow-sm'
					: 'bg-purple-accent/5 text-purple-accent hover:bg-purple-accent/10'}"
			>
				In Progress ({taskStore.inprogressTasks})
			</button>
			<button
				onclick={() => (filterStatus = 'completed')}
				class="rounded-full px-4 py-1.5 text-sm font-medium transition-colors {filterStatus === 'completed'
					? 'bg-lime-accent text-white shadow-sm'
					: 'bg-lime-accent/10 text-lime-accent hover:bg-lime-accent/20'}"
			>
				Completed ({taskStore.completedTasks})
			</button>
		</div>
	</div>
	<div class="my-10 space-y-5">
		{#each filteredTasks as task (task?.id)}
			<TaskCard {task} />
		{:else}
			<p class="rounded-xl border border-gray-200 p-12 text-center text-sm text-gray-400">No tasks match this filter</p>
		{/each}
	</div>
</main>
