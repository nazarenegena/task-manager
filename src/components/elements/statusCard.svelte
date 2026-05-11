<script lang="ts">
	interface statusCardProps {
		taskCount: number;
		statusTitle?: string;
	}
	let { taskCount, statusTitle }: statusCardProps = $props();
</script>

<div class="h-24 w-48 rounded-xl border border-primary/15 p-4 shadow-md">
	<p class="text-3xl font-semibold">{taskCount}</p>
	<p class="text-primary/70">{statusTitle}</p>
</div>
