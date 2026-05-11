<script lang="ts">
	// imports
	import StatusCard from '../elements/statusCard.svelte';
	import Button from './../elements/button.svelte';
	import type { taskObj, statusType } from '../../types/taskTypes';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
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
	let status: statusType | '' = $state('');
	let editingId = $state<string | null>(null);

	const handleAdd = () => {
		if (!todo?.trim()) return;

		if (editingId) {
			editTask(editingId, todo);
			editingId = null;
		} else {
			addTask(todo, status);
		}
		todo = '';
		status = '';
	};

	const startEdit = (task: taskObj) => {
		editingId = task.id;
		todo = task.description;
	};
</script>

<div class="flex items-center space-x-4">
	<LayoutDashboard class="text h-10 w-10 rounded-lg bg-lime-accent/15 p-2 text-lime-accent" />
	<div>
		<h1 class="text-2xl font-bold">Dashboard</h1>
		<h3 class="text-primary/60">Manage your tasks and stay productive</h3>
	</div>
</div>

<main>
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
				<Button
					onclick={handleAdd}
					btnStatus={editingId ? 'Save' : 'Add'}
					className="w-32 my-4 bg-primary text-secondary"
				/>
			</div>
		</div>
		<div>
			{#each tasks as task (task?.id)}
				<div>
					<div class={task.status === 'completed' ? 'line-through' : ''}>
						{task?.description}
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
</main>
