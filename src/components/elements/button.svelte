<script lang="ts">
	// imports
	import type { Component } from 'svelte';

	interface BtnProps {
		btnStatus: string | Component<any>;
		icon?: Component<any>;
		onclick?: () => void;
		className?: string;
	}

	let { btnStatus: BtnStatus, onclick, className, icon: Icon }: BtnProps = $props();
</script>

<button
	{onclick}
	class={`${className}  mx-2 flex cursor-pointer items-center justify-between rounded-md border border-gray-300 p-2 text-gray-700`}
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
