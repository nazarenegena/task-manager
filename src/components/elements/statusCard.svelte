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
			bg: 'bg-lime-accent/5',
			border: 'border-lime-accent/80'
		},
		inprogress: {
			text: 'text-purple-accent',
			bg: 'bg-purple-accent/5',
			border: 'border-purple-accent/40'
		},
		scheduled: { text: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-300' },
		pending: { text: 'text-amber-600', bg: 'bg-amber-100/5', border: 'border-amber-300' },
		high: { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-300' },
		default: { text: 'text-black', bg: 'bg-white', border: 'border-gray-300' }
	};
	let colorClass = $derived(
		(status ? statusColor[status] : undefined) ??
			(priority ? statusColor[priority] : undefined) ??
			statusColor.default
	);
</script>

<div
	class={`min-w-32 space-y-1 rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-lg ${colorClass.bg} ${colorClass.border}`}
>
	<p class={`${colorClass.text} text-4xl font-bold`}>{taskCount}</p>

	<p class="truncate text-sm font-medium text-primary/50">{statusTitle}</p>
</div>
