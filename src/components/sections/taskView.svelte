<script lang="ts">
	import { taskStore } from '$lib/taskStore.svelte';
	import StatusCard from '../elements/statusCard.svelte';
	import ListFilter from '@lucide/svelte/icons/list-filter';
	import ListTodo from '@lucide/svelte/icons/list-todo';
	import TaskCard from '../elements/taskCard.svelte';
	import FilterButton from '../elements/filterButton.svelte';

	let filterStatus = $state<'all' | 'completed' | 'inprogress' | 'pending'>('all');
	let filterPriority = $state<'all' | 'high' | 'medium' | 'low'>('all');
	let sortBy = $state<'date' | 'priority'>('date');
	let sortDir = $state<'asc' | 'desc'>('asc');

	let filteredByStatus = $derived(
		filterStatus === 'all'
			? taskStore.tasks
			: filterStatus === 'pending'
				? taskStore.tasks.filter((t) => t.status !== 'completed')
				: taskStore.tasks.filter((t) => t.status === filterStatus)
	);

	let filteredByPriority = $derived(
		filterPriority === 'all'
			? filteredByStatus
			: filteredByStatus.filter((t) => t.priority === filterPriority)
	);

	let sortedTasks = $derived.by(() => {
		const sorted = [...filteredByPriority];
		if (sortBy === 'date') {
			sorted.sort((a, b) => {
				if (!a.date) return 1;
				if (!b.date) return -1;
				return sortDir === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
			});
		} else {
			const rank: Record<string, number> = { high: 0, medium: 1, low: 2 };

			sorted.sort((a, b) =>
				sortDir === 'asc'
					? (rank[a.priority ?? 'low'] ?? 2) - (rank[b.priority ?? 'low'] ?? 2)
					: (rank[b.priority ?? 'low'] ?? 2) - (rank[a.priority ?? 'low'] ?? 2)
			);
		}
		return sorted;
	});
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
		<div class="space-y-4">
			<div>
				<p class="mb-2 text-xs font-medium uppercase tracking-wide text-primary/50">Status</p>
				<div class="flex flex-wrap gap-2">
					<FilterButton
						name="All"
						onclick={() => (filterStatus = 'all')}
						active={filterStatus === 'all'}
						activeClass="bg-primary text-secondary shadow-md"
						inactiveClass="bg-gray-100 text-gray-500 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
					/>
					<FilterButton
						name="Pending"
						onclick={() => (filterStatus = 'pending')}
						active={filterStatus === 'pending'}
						activeClass="bg-amber-500 text-white shadow-md"
						inactiveClass="bg-amber-50 text-amber-600 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
					/>
					<FilterButton
						name="In Progress"
						onclick={() => (filterStatus = 'inprogress')}
						active={filterStatus === 'inprogress'}
						activeClass="bg-purple-accent text-white shadow-md"
						inactiveClass="bg-purple-accent/5 text-purple-accent shadow-sm hover:-translate-y-0.5 hover:shadow-md"
					/>
					<FilterButton
						name="Completed"
						onclick={() => (filterStatus = 'completed')}
						active={filterStatus === 'completed'}
						activeClass="bg-lime-accent text-white shadow-md"
						inactiveClass="bg-lime-accent/10 text-lime-accent shadow-sm hover:-translate-y-0.5 hover:shadow-md"
					/>
				</div>
			</div>

			<div>
				<p class="mb-2 text-xs font-medium uppercase tracking-wide text-primary/50">Priority</p>
				<div class="flex flex-wrap gap-2">
					<FilterButton
						name="All"
						onclick={() => (filterPriority = 'all')}
						active={filterPriority === 'all'}
						activeClass="bg-primary text-secondary shadow-md"
						inactiveClass="bg-gray-100 text-gray-500 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
					/>
					<FilterButton
						name="High"
						onclick={() => (filterPriority = 'high')}
						active={filterPriority === 'high'}
						activeClass="bg-red-600 text-white shadow-md"
						inactiveClass="bg-red-50 text-red-600 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
					/>
					<FilterButton
						name="Medium"
						onclick={() => (filterPriority = 'medium')}
						active={filterPriority === 'medium'}
						activeClass="bg-amber-500 text-white shadow-md"
						inactiveClass="bg-amber-50 text-amber-600 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
					/>
					<FilterButton
						name="Low"
						onclick={() => (filterPriority = 'low')}
						active={filterPriority === 'low'}
						activeClass="bg-gray-500 text-white shadow-md"
						inactiveClass="bg-gray-100 text-gray-500 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
					/>
				</div>
			</div>

			<div>
				<p class="mb-2 text-xs font-medium uppercase tracking-wide text-primary/50">Sort By</p>
				<div class="flex flex-wrap gap-2">
					<button
						onclick={() => { sortBy = 'date'; sortDir = sortDir === 'asc' ? 'desc' : 'asc'; }}
						class="rounded-full px-5 py-2 text-sm font-medium transition-all duration-150 select-none active:scale-95 {sortBy === 'date'
							? 'bg-primary/10 border border-primary/20 text-primary shadow-sm'
							: 'text-gray-500 hover:text-gray-700'}"
					>
						Date {sortDir === 'asc' ? '↑' : '↓'}
					</button>
					<button
						onclick={() => { sortBy = 'priority'; sortDir = sortDir === 'asc' ? 'desc' : 'asc'; }}
						class="rounded-full px-5 py-2 text-sm font-medium transition-all duration-150 select-none active:scale-95 {sortBy === 'priority'
							? 'bg-primary/10 border border-primary/20 text-primary shadow-sm'
							: 'text-gray-500 hover:text-gray-700'}"
					>
						Priority {sortDir === 'asc' ? '↑' : '↓'}
					</button>
				</div>
			</div>
		</div>
	</div>
	<div class="my-10 space-y-5">
		{#each sortedTasks as task (task?.id)}
			<TaskCard {task} />
		{:else}
			<p class="rounded-xl border border-gray-200 p-12 text-center text-sm text-gray-400">
				No tasks match this filter
			</p>
		{/each}
	</div>
</main>
