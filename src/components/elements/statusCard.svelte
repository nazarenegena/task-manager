<script lang="ts">
	import type { statusType, priorityType } from '../../types/taskTypes';
	import { statusColors, priorityColors } from '$lib/priorityColors';

	interface statusCardProps {
		taskCount: number;
		statusTitle?: string;
		status?: statusType;
		priority?: priorityType;
	}

	let { taskCount, statusTitle, status, priority }: statusCardProps = $props();

	let colorClass = $derived.by(() => {
		if (status && statusColors[status]) return statusColors[status];
		if (priority && priorityColors[priority]) return priorityColors[priority];
		return { text: 'text-black', bg: 'bg-white', border: 'border-gray-300' };
	});
</script>

<div
	class={`min-w-32 space-y-1 rounded-xl border p-4 shadow-sm ${colorClass.bg} ${colorClass.border}`}
>
	<p class={`${colorClass.text} text-4xl font-bold`}>{taskCount}</p>

	<p class="truncate text-sm font-medium text-primary/50">{statusTitle}</p>
</div>
