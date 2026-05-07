<script lang="ts">
	interface viewCardProps {
		viewCardTitle: string;
		onclick: () => void;
		className: string;
	}

	let { viewCardTitle, onclick, className }: viewCardProps = $props();
</script>

<button {onclick} class={`${className} cursor-pointer`}>
	{viewCardTitle}
</button>
