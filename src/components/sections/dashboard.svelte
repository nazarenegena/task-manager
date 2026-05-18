<script lang="ts">
	// imports
	import StatusCard from '../elements/statusCard.svelte';
	import Button from './../elements/button.svelte';
	import type { taskObj, statusType, priorityType } from '../../types/taskTypes';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { addTask, getTasks, deleteTask, editTask } from '../../utils/tasks.svelte';

	// functionality
	const tasks = getTasks();
	const updateTaskStatus = (id: string, newStatus: statusType) => {
		const task = tasks?.find((t) => t?.id === id);
		if (task) task.status = newStatus;
	};
	const completedTasks = $derived(tasks.filter((t) => t?.status === 'completed').length);
	const scheduledTasks = $derived(tasks.filter((t) => t?.status === 'scheduled').length);
	const inprogress = $derived(tasks.filter((t) => t?.status === 'inprogress').length);
	let highPriorities = $derived(tasks.filter((t) => t?.priority === 'high'));
	let todo: string = $state('');
	let todoDate: string = $state('');
	let todoDescription: string = $state('');
	let priority: priorityType | '' = $state('');
	let todoCategory: string = $state('');
	let status: statusType | '' = $state('');
	let editingId = $state<string | null>(null);

	const handleAdd = () => {
		if (!todo?.trim()) return;

		if (editingId) {
			editTask(editingId, todo, priority, todoCategory, todoDescription, todoDate);
			editingId = null;
		} else {
			addTask(todo, status, priority, todoCategory, todoDescription, todoDate);
		}
		todo = '';
		status = '';
		priority = '';
		todoCategory = '';
		todoDescription = '';
	};

	const startEdit = (task: taskObj) => {
		editingId = task.id;
		todo = task.description;
	};

	// task dropdown
	let priorityDropdown = $state(false);
	let openDropdown = $state(false);
</script>

<div class="flex items-center space-x-4">
	<LayoutDashboard class="text h-10 w-10 rounded-lg bg-lime-accent/15 p-2 text-lime-accent" />
	<div>
		<h1 class="text-2xl font-bold">Dashboard</h1>
		<h3 class="text-primary/60">Manage your tasks and stay productive</h3>
	</div>
</div>

<main class="my-20">
	<div>
		<div class="flex space-x-10">
			<StatusCard statusTitle="Total Tasks" taskCount={tasks.length} />
			<StatusCard statusTitle="Completed" taskCount={completedTasks} status="completed" />
			<StatusCard statusTitle="Scheduled" taskCount={scheduledTasks} status="scheduled" />
			<StatusCard statusTitle="Inprogress" taskCount={inprogress} status="inprogress" />
			<StatusCard statusTitle="High Priority" taskCount={highPriorities.length} priority="high" />
		</div>

		<div
			class="my-10 flex justify-between gap-x-8 rounded-md border border-primary/15 px-6 py-4 shadow-md"
		>
			<input
				type="text"
				bind:value={todo}
				placeholder={editingId ? 'Edit task ...' : 'What needs to be done ?'}
				class="w-full rounded-3xl border-none focus:ring-2 focus:ring-lime-accent focus:outline-none"
			/>
			<div class="flex items-center justify-between gap-4">
				<ChevronDown class=" cursor-pointer" onclick={() => (openDropdown = !openDropdown)} />
				<Button
					onclick={handleAdd}
					btnStatus={editingId ? 'Save' : 'Add'}
					className="px-10 bg-primary text-secondary text-center "
				/>
			</div>
		</div>
	</div>
	<!-- Descriptiondrop down -->

	{#if openDropdown}
		<div class=" my-6 space-y-10 rounded-md border border-primary/15 px-6 py-6 shadow-md">
			<div class="space-y-4">
				<p class="text-primary/70">Description</p>
				<input
					type="text"
					bind:value={todoDescription}
					placeholder="Add more details about your task ..."
					class="h-20 w-full rounded-lg border-primary/15 px-4 py-1 focus:ring-2 focus:ring-lime-accent focus:outline-none"
				/>
			</div>

			<div class="flex items-center space-y-2 space-x-10">
				<div class="relative flex flex-col">
					<p class="text-primary/70">Priority</p>

					<select
						bind:value={priority}
						class="h-10 w-80 appearance-none rounded-md border-primary/15 px-4 py-1 focus:ring-1 focus:ring-lime-accent focus:outline-none"
					>
						<option value="">Select priority ...</option>
						<option value="low">low</option>
						<option value="medium">medium</option>
						<option value="high">high</option>
					</select>
				</div>
				<div>
					<p class="text-primary/70">Due Date</p>
					<input
						type="date"
						bind:value={todoDate}
						class="h-10 w-80 rounded-md border-primary/15 px-4 py-1 focus:ring-2 focus:ring-lime-accent focus:outline-none"
					/>
				</div>
			</div>
			<div class="space-y-4">
				<p class="text-primary/70">Category</p>
				<input
					type="text"
					bind:value={todoCategory}
					placeholder="e.g.., Work, Personal, Shopping"
					class="h-10 w-full rounded-md border-primary/15 px-4 py-1 focus:ring-2 focus:ring-lime-accent focus:outline-none"
				/>
			</div>
		</div>
	{/if}

	<div>
		{#each tasks as task (task?.id)}
			<div>
				<div class={task?.status === 'completed' ? 'line-through' : ''}>
					{task?.title}
				</div>
				<Button
					onclick={() => startEdit(task)}
					btnStatus="Edit"
					className="border-gray-400 text-primary"
				/>
				{#each ['completed', 'inprogress', 'scheduled'] as const as s (s)}
					<Button
						onclick={() => updateTaskStatus(task?.id, s)}
						btnStatus={s}
						className={task?.status === s ? 'bg-lime-accent text-primary' : ''}
					/>
				{/each}
				<Button
					onclick={() => deleteTask(task?.id)}
					btnStatus="Delete"
					className="w-32 my-4 bg-red-600 text-secondary"
				/>
				<Button
					onclick={() => {
						editingId = null;
						todo = '';
					}}
					btnStatus="Cancel"
					className="w-32 my-4 bg-red-600 text-secondary"
				/>
			</div>
		{:else}
			<p>No tasks found!</p>
		{/each}
	</div>
</main>
