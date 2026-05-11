<script lang="ts">
	interface viewCardProps {
		viewCardTitle: string;
		onclick: () => void;
		className: string;
	}

	let { viewCardTitle, onclick, className, icon: Icon }: viewCardProps = $props();
</script>

<button {onclick} class={`${className}  flex w-full cursor-pointer justify-center gap-x-4 p-2`}>
	<Icon />
	{viewCardTitle}
</button>
