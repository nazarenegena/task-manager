<script lang="ts">
	// imports
	import StatusCard from '../elements/statusCard.svelte';
	import Button from './../elements/button.svelte';
	import type { taskObj, statusType } from '../../types/taskTypes';
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

<header>
	<h1>Dashboard</h1>
	<h3>Manage your tasks and stay productive</h3>
</header>

<main>
	<main class="my-20">
		<div>
			<div class="grid grid-cols-3 gap-4">
				<StatusCard statusTitle="Completed" taskCount={completedTasks} />
				<StatusCard statusTitle="Scheduled" taskCount={scheduledTasks} />
				<StatusCard statusTitle="Inprogress" taskCount={inprogress} />
			</div>
			<div class="flex">
				<input
					type="text"
					bind:value={todo}
					placeholder={editingId ? 'Edit task ...' : 'Enter your task'}
				/>
				<Button
					onclick={handleAdd}
					btnStatus={editingId ? 'Save' : 'Add'}
					className="w-32 my-4 bg-teal-600 text-white"
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
						className="bg-teal-600 border-teal-600 text-white"
					/>
					{#each ['completed', 'inprogress', 'scheduled'] as const as s (s)}
						<Button
							onclick={() => updateTaskStatus(task?.id, s)}
							btnStatus={s}
							className={task?.status === s ? 'bg-teal-600 border-teal-600 text-white' : ''}
						/>
					{/each}
					<Button
						onclick={() => deleteTask(task?.id)}
						btnStatus="Delete"
						className="w-32 my-4 bg-teal-600 text-white"
					/>
					<Button
						onclick={() => {
							editingId = null;
							todo = '';
						}}
						btnStatus="Cancel"
						className="w-32 my-4 bg-red-600 text-white"
					/>
				</div>
			{:else}
				<p>No tasks found!</p>
			{/each}
		</div>
	</main>
</main>
