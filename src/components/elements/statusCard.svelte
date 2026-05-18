<script lang="ts">
	import type { statusType, priorityType } from '../../types/taskTypes';

	interface statusCardProps {
		taskCount: number;
		statusTitle?: string;
		status?: statusType;
		priority?: priorityType;
	}
	let { taskCount, statusTitle, status, priority }: statusCardProps = $props();
	let statusColor: Record<string, { text: string; bg: string; border: string }> = {
		completed: {
			text: 'text-lime-accent',
			bg: 'bg-lime-accent/10',
			border: 'border-lime-accent/80'
		},
		inprogress: {
			text: 'text-purple-accent',
			bg: 'bg-purple-accent/5',
			border: 'border-purple-accent/40'
		},
		high: { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-300' },
		default: { text: 'text-black', bg: 'bg-white', border: 'border-gray-200' }
	};
	let colorClass = $derived(
		() => (statusColor[status as string] || statusColor[priority as string]) ?? statusColor.default
	);
</script>

<div
	class={`h-24 w-48 rounded-xl border border-primary/15 p-4 shadow-md ${colorClass().bg} ${colorClass().border}`}
>
	<p class={`${colorClass().text} text-3xl font-semibold`}>{taskCount}</p>

	<p class="text-primary/70">{statusTitle}</p>
</div>
