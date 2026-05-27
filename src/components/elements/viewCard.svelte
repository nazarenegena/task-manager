<script lang="ts">
	// imports
	import type { Component } from 'svelte';

	interface viewCardProps {
		viewCardTitle: string;
		onclick: () => void;
		className: string;
		icon: Component<any>;
	}

	let { viewCardTitle, onclick, className, icon: Icon }: viewCardProps = $props();
</script>

<button
	{onclick}
	class={`${className} flex w-full cursor-pointer items-center justify-center gap-x-2 p-3 transition-colors hover:bg-primary/5`}
>
	<Icon class="h-5 w-5" />
	<span class="text-sm font-medium">{viewCardTitle}</span>
</button>
