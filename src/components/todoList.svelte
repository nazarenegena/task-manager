<script lang="ts">
	import Button from './button.svelte';
	type todoStatusType = 'completed' | 'scheduled' | 'inprogress';
	import type { todoObj } from '../types/taskTypes';
	import StatusCard from './statusCard.svelte';

	let todo: string = $state('');
	let status: todoStatusType | '' = $state('');
	let tasks = $state<todoObj[]>([]);
	let completedTasks = $derived(tasks.filter((t) => t?.todoStatus === 'completed').length);
	let scheduledTasks = $derived(tasks.filter((t) => t?.todoStatus === 'scheduled').length);
	let inprogress = $derived(tasks.filter((t) => t?.todoStatus === 'inprogress').length);

	const updateTaskStatus = (id: string, newStatus: todoStatusType) => {
		const task = tasks?.find((t) => t?.id === id);
		if (task) task.todoStatus = newStatus;
	};

	const addTodo = () => {
		if (!todo?.trim()) return;
		const newTodo: todoObj = {
			id: crypto.randomUUID(),
			todoTitle: todo,
			todoStatus: status
		};
		tasks = [...tasks, newTodo];
		todo = '';
		status = '';
	};
</script>

<header>
	<h1>Todo's</h1>
	<h2>Fix the UI</h2>
</header>

<main>
	<div>
		<div>
			completed tasks {completedTasks}
		</div>
		<div>
			scheduledTask {scheduledTasks}
		</div>
		<div>
			inprogress {inprogress}
		</div>
		<div>
			<StatusCard task={tasks.find((t) => t?.todoStatus === 'inprogress')} />
		</div>
		<div class="flex">
			<input type="text" bind:value={todo} placeholder="enter your todo" />
			<Button onclick={addTodo} btnStatus="Add" className="w-32 my-4 bg-teal-600 text-white" />
		</div>
	</div>
	<div>
		{#each tasks as task (task?.id)}
			<div>
				<div>
					{task?.todoTitle}
				</div>
				{#each ['completed', 'inprogress', 'scheduled'] as const as s (s)}
					<Button
						onclick={() => updateTaskStatus(task?.id, s)}
						btnStatus={s}
						className={task?.todoStatus === s ? 'bg-teal-600 border-teal-600 text-white' : ''}
					/>
				{/each}
			</div>
		{:else}
			<p>No tasks found!</p>
		{/each}
	</div>
</main>
