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
	let todo: string = $state('');
	let todoDate: string = $state('');
	let todoDescription: string = $state('');
	let priority: priorityType | '' = $state('Low');
	let todoCategory: string = $state('');
	let status: statusType | '' = $state('');
	let editingId = $state<string | null>(null);

	let filteredPriorities = $derived(tasks.filter((t) => t?.priority === priority));

	const handleAdd = () => {
		if (!todo?.trim()) return;

		if (editingId) {
			editTask(editingId, todo, priority, todoCategory, todoDescription);
			editingId = null;
		} else {
			addTask(todo, status, priority, todoCategory, todoDescription);
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
			<StatusCard statusTitle="Completed" taskCount={completedTasks} />
			<StatusCard statusTitle="Scheduled" taskCount={scheduledTasks} />
			<StatusCard statusTitle="Inprogress" taskCount={inprogress} />
		</div>
		<div class="my-10 flex">
			<input
				type="text"
				bind:value={todo}
				placeholder={editingId ? 'Edit task ...' : 'Enter your task'}
			/>
			<Button onclick={() => (openDropdown = !openDropdown)} btnStatus={ChevronDown} />
			<Button
				onclick={handleAdd}
				btnStatus={editingId ? 'Save' : 'Add'}
				className="w-32 my-4 bg-primary text-secondary"
			/>
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
				<div class=" relative flex flex-col">
					<p class="text-primary/70">Priority</p>
					<Button
						onclick={() => (priorityDropdown = !priorityDropdown)}
						btnStatus={priority}
						className="w-80 h-10  border-primary/15 px-4 py-1 focus:ring-2 focus:ring-lime-accent focus:outline-none"
						icon={ChevronDown}
					/>
					{#if priorityDropdown}
						<div
							class="absolute top-12 right-0 flex flex-col gap-3 rounded-md border border-primary/10 bg-secondary px-2 py-4 shadow-md"
						>
							{#each ['low', 'medium', 'high'] as priotityItem (priotityItem)}
								<label class="rounded-xl px-2 py-1 hover:bg-purple-accent/10">
									<input
										type="radio"
										bind:group={priority}
										value={priotityItem}
										placeholder="Select priority ..."
									/>
									<span>{priotityItem}</span>
								</label>
							{/each}
						</div>
					{/if}
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
				<div class={task.status === 'completed' ? 'line-through' : ''}>
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
