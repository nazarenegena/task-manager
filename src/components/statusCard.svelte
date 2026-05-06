<script lang="ts">
	interface statusCardProps {
		taskCount: number;
		statusTitle?: string;
	}
	let { taskCount, statusTitle }: statusCardProps = $props();
</script>

<div>
	<p>{statusTitle} {taskCount}</p>
</div>
