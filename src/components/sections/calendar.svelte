<script lang="ts">
	import { SvelteDate } from 'svelte/reactivity';
	import {
		Calendar,
		type CalendarEvent,
		type CalendarInstanceApi,
		type CellContext,
		type EventContext
	} from '@svar-ui/svelte-calendar';
	import { taskStore } from '$lib/taskStore.svelte';
	import { priorityColors } from '$lib/priorityColors';
	import { formatDay, isSameDay } from '$lib/dates';
	import TaskForm from '../elements/taskForm.svelte';
	import CalendarEventContent from '../elements/calendarEventContent.svelte';
	import CalendarEventPopup from '../elements/calendarEventPopup.svelte';
	import CalendarCheck2 from '@lucide/svelte/icons/calendar-check-2';
	import Check from '@lucide/svelte/icons/check';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import CircleSlash2 from '@lucide/svelte/icons/circle-slash-2';
	import Plus from '@lucide/svelte/icons/plus';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import type { priorityType } from '../../types/taskTypes';

	type EventID = string | number;

	const viewOptions = [
		{ id: 'day', label: 'Day' },
		{ id: 'week', label: 'Week' },
		{ id: 'month', label: 'Month' }
	];

	let calendarApi: CalendarInstanceApi | undefined;
	let anchorDate = $state(new Date());
	let currentView = $state('week');
	let rangeLabel = $state('');
	let formWrap = $state<HTMLDivElement | null>(null);

	const events = $derived(
		taskStore.tasks
			.filter((task) => task.startTime && task.endTime)
			.map((task) => ({
				id: task.id,
				start: combineTime(task.date, task.startTime, false),
				end: combineTime(task.date, task.endTime, true),
				text: task.title,
				description: task.description,
				priority: task.priority,
				status: task.status,
				category: task.category
			}))
	);

	const noTimeTasks = $derived(taskStore.tasks.filter((task) => !task.startTime || !task.endTime));

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

	function timeOf(d: Date, isEnd = false): string {
		if (!d) return isEnd ? '23:59' : '00:00';
		const h = String(d.getHours()).padStart(2, '0');
		const m = String(d.getMinutes()).padStart(2, '0');
		return `${h}:${m}`;
	}

	function resolveEvent(
		id: EventID | undefined,
		fallback?: Partial<CalendarEvent>
	): CalendarEvent | undefined {
		if (id !== undefined && calendarApi) {
			const ev = calendarApi.getEvent(id);
			if (ev) return ev;
		}
		return fallback as CalendarEvent | undefined;
	}

	function handleAddEvent(payload: { event?: Partial<CalendarEvent>; id?: EventID }) {
		const ev = resolveEvent(payload.id, payload.event);
		if (!ev?.start) return;
		const title = String(ev.text ?? ev.title ?? 'New task').trim() || 'New task';
		const allDay = ev.allDay === true;
		const task = taskStore.addTask(
			title,
			'scheduled',
			(ev.priority as priorityType) || 'medium',
			(ev.category as string) || '',
			(ev.description as string) || '',
			ev.start,
			allDay ? '' : timeOf(ev.start),
			allDay ? '' : timeOf(ev.end, true)
		);
		taskStore.startEdit(task);
		scrollToForm();
	}

	function handleUpdateEvent(payload: { event?: Partial<CalendarEvent>; id?: EventID }) {
		const ev = resolveEvent(payload.id, payload.event);
		if (!ev) return;
		const allDay = ev.allDay === true;
		taskStore.syncFromCalendar(String(ev.id), {
			date: ev.start,
			startTime: allDay ? '' : timeOf(ev.start),
			endTime: allDay ? '' : timeOf(ev.end, true),
			title: ev.text ?? ev.title,
			description: ev.description
		});
	}

	function handleDeleteEvent(payload: { id: EventID }) {
		taskStore.deleteTask(String(payload.id));
	}

	function cellCss(ctx: CellContext): string {
		const { date } = ctx;
		if (!date) return '';
		const day = date.getDay();
		const classes: string[] = [];
		if (day === 0 || day === 6) classes.push('c-weekend');
		if (isSameDay(date, new Date())) classes.push('c-today');
		return classes.join(' ');
	}

	function eventCss(ctx: EventContext): string {
		const parts = ['ev-cal'];
		if (ctx.event.status === 'completed') {
			parts.push('ev-completed');
		} else {
			const priority = (ctx.event.priority as priorityType) || '';
			parts.push(priority ? `ev-${priority}` : 'ev-none');
		}
		return parts.join(' ');
	}

	function navigate(direction: 'previous' | 'now' | 'next') {
		calendarApi?.exec('navigate-time', { direction });
	}

	function selectView(view: string) {
		calendarApi?.exec('navigate-to', { view });
	}

	function openNewTask() {
		taskStore.newTask(anchorDate);
		scrollToForm();
	}

	function scrollToForm() {
		requestAnimationFrame(() => formWrap?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
	}
</script>

<div class="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
	<div class="mb-4 flex flex-wrap items-center gap-x-6 gap-y-3">
		<div class="flex items-center gap-3">
			<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-accent/15">
				<CalendarCheck2 class="h-5 w-5 text-lime-accent" />
			</div>
			<div>
				<h1 class="text-xl leading-tight font-bold">Calendar</h1>
				<p class="text-sm text-primary/60">{rangeLabel || 'View your scheduled tasks'}</p>
			</div>
		</div>

		<div class="ml-auto flex flex-wrap items-center gap-3">
			<div class="flex items-center gap-1.5">
				<button
					onclick={() => navigate('previous')}
					aria-label="Previous"
					class="cursor-pointer rounded-lg border border-gray-200 bg-white p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-primary"
				>
					<ChevronLeft class="h-4 w-4" />
				</button>
				<button
					onclick={() => navigate('now')}
					class="cursor-pointer rounded-lg border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-primary"
				>
					Today
				</button>
				<button
					onclick={() => navigate('next')}
					aria-label="Next"
					class="cursor-pointer rounded-lg border border-gray-200 bg-white p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-primary"
				>
					<ChevronRight class="h-4 w-4" />
				</button>
			</div>

			<div class="flex items-center rounded-lg bg-primary/5 p-1">
				{#each viewOptions as view (view?.id)}
					<button
						onclick={() => selectView(view?.id)}
						class="cursor-pointer rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors {currentView ===
						view?.id
							? 'bg-secondary text-primary shadow-sm'
							: 'text-primary/60 hover:text-primary'}"
					>
						{view?.label}
					</button>
				{/each}
			</div>

			<button
				onclick={openNewTask}
				class="flex cursor-pointer items-center gap-1.5 rounded-lg bg-lime-accent px-4 py-2 text-sm font-semibold text-primary shadow-sm transition-all hover:shadow-md active:scale-95"
			>
				<Plus class="h-4 w-4" />
				New Task
			</button>
		</div>
	</div>

	<div class="mb-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-gray-500">
		<span class="flex items-center gap-1.5">
			<span class="h-2.5 w-2.5 rounded-full" style="background:{priorityColors.high.dot}"></span>
			High
		</span>
		<span class="flex items-center gap-1.5">
			<span class="h-2.5 w-2.5 rounded-full" style="background:{priorityColors.medium.dot}"></span>
			Medium
		</span>
		<span class="flex items-center gap-1.5">
			<span class="h-2.5 w-2.5 rounded-full" style="background:{priorityColors.low.dot}"></span>
			Low
		</span>
		<span class="flex items-center gap-1.5">
			<span class="h-2.5 w-2.5 rounded-full border border-lime-accent bg-lime-accent/40"></span>
			Completed
		</span>
		<span class="ml-auto hidden text-primary/40 sm:inline">Tip: drag events to reschedule</span>
	</div>

	{#if taskStore.openDropdown}
		<div bind:this={formWrap} class="mb-5">
			<TaskForm />
		</div>
	{/if}

	{#if taskStore.tasks.length === 0}
		<div
			class="mb-4 rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400"
		>
			No tasks yet — click “New Task” to plan your schedule.
		</div>
	{/if}

	{#if noTimeTasks.length > 0}
		<div class="mb-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-4 py-3">
			<p class="mb-2 flex items-center gap-1.5 text-xs font-medium text-gray-500">
				<CircleSlash2 class="h-3.5 w-3.5" />
				No time
				<span class="font-normal text-gray-400">· {noTimeTasks.length}</span>
			</p>
			<div class="flex flex-wrap gap-2">
				{#each noTimeTasks as t (t.id)}
					{@const done = t.status === 'completed'}
					<div
						class="flex items-center gap-2 rounded-md border border-gray-200 bg-white py-1 pr-1.5 pl-2 shadow-sm"
					>
						<button
							onclick={() => taskStore.updateTaskStatus(t.id, done ? 'scheduled' : 'completed')}
							aria-label="Toggle done"
							class="flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded border {done
								? 'border-gray-300 bg-lime-accent/50'
								: 'border-gray-300 bg-white'}"
						>
							{#if done}
								<Check class="h-3 w-3 text-gray-600" />
							{/if}
						</button>
						<button
							onclick={() => {
								taskStore.startEdit(t);
								scrollToForm();
							}}
							class="flex min-w-0 cursor-pointer items-center gap-1.5 text-left"
						>
							<span class="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400"></span>
							<span
								class="truncate text-xs font-medium {done
									? 'text-gray-400 line-through'
									: 'text-gray-700'}"
							>
								{t.title}
							</span>
							<span class="shrink-0 text-[10px] text-gray-400">{formatDay(t.date)}</span>
						</button>
						<button
							onclick={() => taskStore.deleteTask(t.id)}
							aria-label="Delete task"
							class="cursor-pointer p-1 text-gray-300 transition-colors hover:text-red-500"
						>
							<Trash2 class="h-3.5 w-3.5" />
						</button>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<div class="overflow-hidden rounded-xl border border-gray-200">
		<div class="h-[calc(100vh-360px)] min-h-[440px]">
			<Calendar
				{events}
				view={currentView}
				views={['day', 'week', 'month']}
				date={anchorDate}
				{cellCss}
				{eventCss}
				eventContent={CalendarEventContent}
				eventPopup={CalendarEventPopup}
				toolbar={null}
				init={(api) => {
					calendarApi = api;
					api.getReactiveState().currentDate.subscribe((d) => (anchorDate = d));
					api.getReactiveState().currentView.subscribe((v) => (currentView = v));
					api.getReactiveState().rangeLabel.subscribe((l) => (rangeLabel = l));
					api.on('add-event', (p) =>
						handleAddEvent(p as { event?: Partial<CalendarEvent>; id?: EventID })
					);
					api.on('update-event', (p) =>
						handleUpdateEvent(p as { id: EventID; event?: Partial<CalendarEvent> })
					);
					api.on('delete-event', (p) => handleDeleteEvent(p as { id: EventID }));
				}}
			/>
		</div>
	</div>
</div>

<style>
	:global(.wx-calendar) {
		--wx-border: 1px solid #e2e8f0;
		--wx-border-radius: 8px;
		--wx-calendar-weekend-background: #f8fafc;
		--wx-background-alt: #f1f5f9;
		--wx-color-primary-selected: rgba(203, 216, 125, 0.18);
	}

	:global(.wx-popup) {
		z-index: 1000 !important;
	}

	:global(.c-weekend),
	:global(.wx-grid-cell.wx-weekend) {
		background-color: #f8fafc;
	}

	:global(.wx-grid-cell.c-today) {
		background-color: rgba(203, 216, 125, 0.08);
		box-shadow: none;
	}

	:global(.wx-grid-cell.wx-today .wx-day-number) {
		display: flex;
		align-items: center;
		justify-content: center;
		width: fit-content;
		min-width: 22px;
		margin-left: auto;
		background-color: #cbd87d;
		color: #334155;
		border-radius: 9999px;
		padding: 1px 8px;
		font-weight: 600;
	}

	:global(.wx-box-event.ev-cal),
	:global(.wx-bar-event.ev-cal) {
		border-radius: 6px;
		overflow: hidden;
	}

	:global(.wx-box-event.ev-high),
	:global(.wx-bar-event.ev-high) {
		background-color: #fef2f2 !important;
		color: #991b1b;
		border-left: 4px solid #dc2626 !important;
	}

	:global(.wx-box-event.ev-medium),
	:global(.wx-bar-event.ev-medium) {
		background-color: #f3f5dc !important;
		color: #3f5626;
		border-left: 4px solid #cbd87d !important;
	}

	:global(.wx-box-event.ev-low),
	:global(.wx-bar-event.ev-low) {
		background-color: #f0f0f7 !important;
		color: #37376b;
		border-left: 4px solid #6b6ebe !important;
	}

	:global(.wx-box-event.ev-none),
	:global(.wx-bar-event.ev-none) {
		background-color: #f8fafc !important;
		color: #475569;
		border-left: 4px solid #94a3b8 !important;
	}

	:global(.wx-box-event.ev-completed),
	:global(.wx-bar-event.ev-completed) {
		background-color: #eef2e0 !important;
		color: #64748b;
		border-left: 4px solid #cbd87d !important;
	}

	:global(.wx-box-event.ev-completed:hover),
	:global(.wx-bar-event.ev-completed:hover) {
		background-color: #e6ecd3 !important;
	}

	:global(.wx-box-event.ev-high:hover),
	:global(.wx-bar-event.ev-high:hover) {
		background-color: #fde8e8 !important;
	}

	:global(.wx-box-event.ev-medium:hover),
	:global(.wx-bar-event.ev-medium:hover) {
		background-color: #e9edc9 !important;
	}

	:global(.wx-box-event.ev-low:hover),
	:global(.wx-bar-event.ev-low:hover) {
		background-color: #e4e4f0 !important;
	}
</style>
