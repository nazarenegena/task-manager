<script lang="ts">
	import { priorityColors } from '$lib/priorityColors';
	import { formatTimeRange } from '$lib/dates';
	import Check from '@lucide/svelte/icons/check';
	import type { priorityType } from '../../types/taskTypes';
	import type { calendarEventView } from '../../types/calendarTypes';

	let { event, mode }: { event: calendarEventView; mode: string } = $props();

	const done = $derived(event?.status === 'completed');
	const dot = $derived(
		priorityColors[(event?.priority ?? '') as priorityType | '']?.dot ?? priorityColors[''].dot
	);
	const timeLabel = $derived(!event?.allDay ? formatTimeRange(event?.start, event?.end) : '');
</script>

{#if mode === 'boxes'}
	<div class="flex w-full min-w-0 flex-col justify-center px-1.5 py-0.5 leading-tight">
		<span class="truncate text-xs font-medium {done ? 'text-gray-400 line-through' : ''}">
			{event?.text || 'Untitled'}
		</span>
		{#if timeLabel}
			<span class="truncate text-[10px] opacity-75">{timeLabel}</span>
		{/if}
	</div>
{:else}
	<div class="flex w-full min-w-0 items-center gap-1.5 px-1.5 {done ? 'opacity-75' : ''}">
		<span class="h-2 w-2 shrink-0 rounded-full" style="background:{dot}"></span>
		<span class="truncate text-xs font-medium {done ? 'line-through' : ''}">
			{event?.text || 'Untitled'}
		</span>
		{#if event?.category && mode !== 'grid'}
			<span class="hidden truncate text-[10px] opacity-60 sm:inline">· {event?.category}</span>
		{/if}
		{#if done}
			<Check class="h-3 w-3 shrink-0" />
		{/if}
	</div>
{/if}
