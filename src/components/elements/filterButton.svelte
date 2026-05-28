<script lang="ts">
	interface FilterButtonProps {
		name: string;
		onclick: () => void;
		active: boolean;
		activeClass: string;
		inactiveClass: string;
	}
	let { name, onclick, active, activeClass, inactiveClass }: FilterButtonProps = $props();
</script>

<button
	{onclick}
	class="cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-all duration-150 select-none active:scale-95 {active ? activeClass : inactiveClass}"
>
	{name}
</button>
