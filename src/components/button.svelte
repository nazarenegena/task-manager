<script lang="ts">
	interface BtnProps {
		btnStatus: string;
		onclick?: () => void;
		className?: string;
	}

	let { btnStatus, onclick, className }: BtnProps = $props();
</script>

<button
	{onclick}
	class={`${className} mx-2 cursor-pointer rounded-md border border-teal-600  p-2 text-teal-600`}
>
	{btnStatus}
</button>
