<script lang="ts">
	import TaskCard from '../elements/taskCard.svelte';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import { taskStore } from '../../lib/taskStore.svelte';
	import TaskForm from '../elements/taskForm.svelte';
</script>

<div class="flex items-center space-x-4">
	<LayoutDashboard class="text h-10 w-10 rounded-lg bg-lime-accent/15 p-2 text-lime-accent" />
	<div>
		<h1 class="text-2xl font-bold">Dashboard</h1>
		<h3 class="text-primary/60">Manage your tasks and stay productive</h3>
	</div>
</div>

<main class="my-20">
	<TaskForm />
	<div class="space-y-3">
		<p class="text-lg font-bold text-primary/70">Your Tasks</p>

		{#each taskStore?.tasks as task (task?.id)}
			<TaskCard {task} />
		{:else}
			<p class="rounded-xl border border-gray-200 p-20 shadow-sm text-gray-500 text-center">
				No tasks yet. Add one to get started!
			</p>
		{/each}
	</div>
</main>
