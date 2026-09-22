<script lang="ts">
	import type { Component } from 'svelte';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	type AnyComponent = Component<any>;

	interface BtnProps {
		btnStatus: string | AnyComponent;
		icon?: AnyComponent;
		onclick?: () => void;
		className?: string;
	}

	let { btnStatus: BtnStatus, onclick, className, icon: Icon }: BtnProps = $props();
</script>

<button
	{onclick}
	class={`${className} flex cursor-pointer items-center justify-between gap-2 rounded-md transition-colors`}
>
	{#if typeof BtnStatus === 'string'}
		{BtnStatus}
	{:else}
		<BtnStatus />
	{/if}
	{#if Icon}
		<Icon />
	{/if}
</button>
