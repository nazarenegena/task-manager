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
	class={`${className} mx-2 cursor-pointer rounded-md border border-gray-300 p-2 text-gray-700`}
>
	{btnStatus}
</button>
