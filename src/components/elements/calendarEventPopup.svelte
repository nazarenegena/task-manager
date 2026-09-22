<script lang="ts">
	import { taskStore } from '$lib/taskStore.svelte';
	import { priorityColors, statusColors } from '$lib/priorityColors';
	import { formatDay, formatTimeRange } from '$lib/dates';
	import Check from '@lucide/svelte/icons/check';
	import SquarePen from '@lucide/svelte/icons/square-pen';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import X from '@lucide/svelte/icons/x';
	import type { statusType } from '../../types/taskTypes';
	import type { calendarEventView } from '../../types/calendarTypes';

	let { event, close }: { event: calendarEventView; close: () => void } = $props();

	const task = $derived(event?.id !== undefined ? taskStore.getTask(String(event.id)) : undefined);
	const priorityChip = $derived(
		priorityColors[task?.priority ?? '']?.chip ?? priorityColors[''].chip
	);
	const statusChip = $derived(
		task?.status
			? statusColors[(task.status ?? '') as statusType]?.chip
			: statusColors.scheduled.chip
	);
	const subtitle = $derived(
		event?.start
			? `${formatDay(event.start)}${event?.allDay ? '' : ` · ${formatTimeRange(event.start, event.end)}`}`
			: ''
	);

	function toggleComplete() {
		if (!task) return;
		taskStore.updateTaskStatus(task.id, task.status === 'completed' ? 'inprogress' : 'completed');
	}

	function remove() {
		if (!task) return;
		taskStore.deleteTask(task.id);
		close();
	}

	function edit() {
		if (!task) return;
		taskStore.startEdit(task);
		close();
	}
</script>

<div class="w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
	<div class="flex items-start justify-between gap-2">
		<h3 class="min-w-0 flex-1 text-sm font-bold text-primary">
			{event?.text || 'Untitled'}
		</h3>
		<button
			onclick={close}
			aria-label="Close"
			class="shrink-0 cursor-pointer rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-primary"
		>
			<X class="h-4 w-4" />
		</button>
	</div>

	{#if subtitle}
		<p class="mt-1 text-xs text-gray-500">{subtitle}</p>
	{/if}

	{#if event?.category}
		<p class="mt-0.5 text-xs text-gray-400">Category: {event.category}</p>
	{/if}

	<div class="mt-3 flex flex-wrap items-center gap-1.5">
		<span
			class="rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize {priorityChip}"
		>
			{task?.priority || 'No priority'}
		</span>
		<span class="rounded-full px-2.5 py-0.5 text-[11px] font-medium {statusChip}">
			{task?.status || 'scheduled'}
		</span>
	</div>

	<div class="mt-4 flex items-center gap-2">
		<button
			onclick={toggleComplete}
			class="flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-lime-accent transition-colors {task?.status ===
			'completed'
				? 'bg-lime-accent/10'
				: 'hover:bg-lime-accent/10'}"
		>
			<Check class="h-3.5 w-3.5" />
			{task?.status === 'completed' ? 'Completed' : 'Mark done'}
		</button>
		<button
			onclick={edit}
			class="flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100"
		>
			<SquarePen class="h-3.5 w-3.5" />
			Edit
		</button>
		<button
			onclick={remove}
			class="ml-auto flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
		>
			<Trash2 class="h-3.5 w-3.5" />
			Delete
		</button>
	</div>
</div>
