<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Play from '@lucide/svelte/icons/play';
	import SquarePen from '@lucide/svelte/icons/square-pen';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { taskStore } from '$lib/taskStore.svelte';
	import type { taskObj } from '../../types/taskTypes';

	let { task }: { task: taskObj } = $props();

	const priorityColors: Record<string, string> = {
		high: 'text-red-800 bg-red-100 border-red-800',
		medium: 'text-lime-accent bg-lime-accent/10 border-lime-400',
		low: 'text-gray-400 bg-gray-100 border-gray-400'
	};
</script>

<div
	class={`rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-md ${task?.status === 'completed' ? 'border-lime-accent bg-lime-accent/5' : 'border-gray-200 bg-white'}`}
>
	<div class="flex items-center gap-3">
		{#if task?.status === 'completed'}
			<button
				onclick={() => taskStore?.updateTaskStatus(task?.id, 'inprogress')}
				aria-label="Mark as in progress"
				class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-lime-accent transition-colors hover:bg-lime-accent/80"
			>
				<Check class="h-4 w-4 text-white" />
			</button>
		{:else}
			<button
				onclick={() => taskStore?.updateTaskStatus(task?.id, 'completed')}
				aria-label="Mark as completed"
				class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 border-gray-300 transition-colors hover:border-gray-500"
			></button>
		{/if}

		{#if taskStore?.editingId === task?.id}
			<input
				type="text"
				bind:value={taskStore.todo}
				placeholder="Edit task..."
				class="flex-1 rounded-md border border-primary/15 px-3 text-sm focus:ring-2 focus:ring-lime-accent focus:outline-none"
			/>
		{:else}
			<span
				class={task?.status === 'completed'
					? 'flex-1 text-gray-400 line-through'
					: 'flex-1 text-primary'}
			>
				{task?.title}
			</span>
		{/if}

		<button
			onclick={() => taskStore?.updateTaskStatus(task?.id, 'inprogress')}
			aria-label="Start task"
			class={task?.status === 'inprogress' || task?.status === 'completed'
				? 'hidden'
				: 'cursor-pointer text-lime-accent hover:text-lime-accent/80'}
		>
			<Play class="h-4 w-4" />
		</button>

		{#if task?.status === 'inprogress'}
			<span
				class="rounded-full bg-purple-accent/10 px-2.5 py-0.5 text-xs font-medium text-purple-accent"
			>
				In Progress
			</span>
		{:else if task?.status === 'scheduled'}
			<span class="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
				Scheduled
			</span>
		{:else if task?.status === 'completed'}
			<span
				class="rounded-full bg-lime-accent/10 px-2.5 py-0.5 text-xs font-medium text-lime-accent"
			>
				Completed
			</span>
		{/if}

		<button
			onclick={() => taskStore?.startEdit(task)}
			class="cursor-pointer text-gray-400 transition-colors hover:text-primary"
		>
			<SquarePen class="h-4 w-4" />
		</button>

		<button
			onclick={() => taskStore.deleteTask(task?.id)}
			class="cursor-pointer text-gray-400 transition-colors hover:text-red-600"
		>
			<Trash2 class="h-4 w-4" />
		</button>
	</div>

	{#if task?.description || task?.priority || task?.category || task?.date}
		{#if task?.description}
			<p
				class={`mt-1 ml-9 truncate text-sm ${task?.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-500'}`}
			>
				{task?.description}
			</p>
		{/if}
		<div
			class={`mt-0.5 ml-9 flex items-center gap-1.5 text-xs ${task?.status === 'completed' ? 'text-gray-300' : 'text-gray-400'}`}
		>
			{#if task?.priority}
				<span
					class="rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize {priorityColors[
						task?.priority ?? ''
					]}">{task?.priority}</span
				>
			{/if}
			{#if task?.category}
				{#if task?.priority}<span>•</span>{/if}
				<span class="">{task?.category}</span>
			{/if}
			{#if task?.date}
				{#if task?.priority || task?.category}<span>•</span>{/if}
				<span>{task?.date}</span>
			{/if}
		</div>
	{/if}
</div>
