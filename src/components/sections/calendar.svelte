<script lang="ts">
    import { SvelteDate } from 'svelte/reactivity';
	import { Calendar } from '@svar-ui/svelte-calendar';
	import { taskStore } from '$lib/taskStore.svelte';
	const date = $derived(new Date());
	const events = $derived(
		taskStore.tasks.map((task) => ({
			id: task.id,
			start: combineTime(task.date, task.startTime, false),
			end: combineTime(task.date, task.endTime, true),
			text: task.title,
			description: task.description
		}))
	);

	function combineTime(date: Date, time: string, isEnd: boolean): Date {
		const result = new SvelteDate(date);
		if (time) {
			const [hours, minutes] = time.split(':').map(Number);
			result.setHours(hours, minutes, 0, 0);
		} else {
			result.setHours(isEnd ? 23 : 0, isEnd ? 59 : 0, 0, 0);
		}
		return result;
	}
</script>
<main>
    <Calendar {events} {date}/>
</main>
