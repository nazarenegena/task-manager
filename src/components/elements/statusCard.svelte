<script lang="ts">
	interface statusCardProps {
		taskCount: number;
		statusTitle?: string;
	}
	let { taskCount, statusTitle }: statusCardProps = $props();
</script>

<div class="">
	<p>{statusTitle} {taskCount}</p>
</div>
