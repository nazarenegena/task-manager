import type { Component } from '@lucide/svelte';

export type statusType = 'completed' | 'scheduled' | 'inprogress';
export type priorityType = 'high' | 'medium' | 'low';

export interface taskObj {
	id: string;
	title: string;
	description: string;
	category: string | '';
	status: statusType | '' | Component;
	priority: priorityType | '';
	date: string | '';
}
