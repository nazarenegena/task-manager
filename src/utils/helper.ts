
    import { SvelteDate } from 'svelte/reactivity';
    import {
		type CalendarEvent,
		type CalendarInstanceApi,
		type CellContext,
		type EventContext
	} from '@svar-ui/svelte-calendar';

	import { isSameDay } from '$lib/dates';
	import type { priorityType } from '../types/taskTypes';
	import { taskStore } from '$lib/taskStore.svelte';

	type EventID = string | number;


    export function combineTime(date: Date, time: string, isEnd: boolean): Date {
		const result = new SvelteDate(date);
		if (time) {
			const [hours, minutes] = time.split(':').map(Number);
			result.setHours(hours, minutes, 0, 0);
		} else {
			result.setHours(isEnd ? 23 : 0, isEnd ? 59 : 0, 0, 0);
		}
		return result;
    }

    export function timeOf(d: Date, isEnd = false): string {
		if (!d) return isEnd ? '23:59' : '00:00';
		const h = String(d.getHours()).padStart(2, '0');
		const m = String(d.getMinutes()).padStart(2, '0');
		return `${h}:${m}`;
    }

    export function resolveEvent(
		id: EventID | undefined,
		calendarApi: CalendarInstanceApi | undefined,
		fallback?: Partial<CalendarEvent>,
	): CalendarEvent | undefined {
		if (id !== undefined && calendarApi) {
			const ev = calendarApi.getEvent(id);
			if (ev) return ev;
		}
		return fallback as CalendarEvent | undefined;
    }

    export function handleAddEvent(payload: { event?: Partial<CalendarEvent>; id?: EventID }, calendarApi: CalendarInstanceApi | undefined, formWrap: HTMLDivElement | null ) {
		const ev = resolveEvent(payload.id, calendarApi, payload.event);
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
		scrollToForm(formWrap);
    }

    export function handleUpdateEvent(payload: { event?: Partial<CalendarEvent>; id?: EventID }, calendarApi: CalendarInstanceApi | undefined ) {
		const ev = resolveEvent(payload.id, calendarApi, payload.event);
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


    export function handleDeleteEvent(payload: { id: EventID }) {
		taskStore.deleteTask(String(payload.id));
	}

    export function cellCss(ctx: CellContext): string {
	const { date } = ctx;
	if (!date) return '';
	const day = date.getDay();
	const classes: string[] = [];
	if (day === 0 || day === 6) classes.push('c-weekend');
	if (isSameDay(date, new Date())) classes.push('c-today');
	return classes.join(' ');
    }

    export function eventCss(ctx: EventContext): string {
	const parts = ['ev-cal'];
	if (ctx.event.status === 'completed') {
		parts.push('ev-completed');
	} else {
		const priority = (ctx.event.priority as priorityType) || '';
		parts.push(priority ? `ev-${priority}` : 'ev-none');
	}
	return parts.join(' ');
    }

    export function navigate(direction: 'previous' | 'now' | 'next', calendarApi: CalendarInstanceApi | undefined ) {
	calendarApi?.exec('navigate-time', { direction });
	}

    export function selectView(view: string, calendarApi: CalendarInstanceApi | undefined ) {
	calendarApi?.exec('navigate-to', { view });
	}

	export function openNewTask(anchorDate: Date, formWrap: HTMLDivElement | null) {
		taskStore.newTask(anchorDate);
		scrollToForm(formWrap);
	}

	export function scrollToForm(formWrap: HTMLDivElement | null) {
		requestAnimationFrame(() => formWrap?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
	}
