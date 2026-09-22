import type { priorityType, statusType } from '../types/taskTypes';

export interface priorityColorScheme {
	text: string;
	bg: string;
	border: string;
	chip: string;
	dot: string;
	solid: string;
}

/**
 * Single source of truth for priority colors.
 * high = red (the only red), medium = lime-accent, low = purple-accent.
 */
export const priorityColors: Record<priorityType | '', priorityColorScheme> = {
	high: {
		text: 'text-red-700',
		bg: 'bg-red-50',
		border: 'border-red-300',
		chip: 'border-red-300 bg-red-50 text-red-700',
		dot: '#dc2626',
		solid: 'bg-red-600'
	},
	medium: {
		text: 'text-lime-accent',
		bg: 'bg-lime-accent/10',
		border: 'border-lime-400',
		chip: 'border-lime-400 bg-lime-accent/10 text-lime-accent',
		dot: '#cbd87d',
		solid: 'bg-lime-accent'
	},
	low: {
		text: 'text-purple-accent',
		bg: 'bg-purple-accent/10',
		border: 'border-purple-300',
		chip: 'border-purple-300 bg-purple-accent/10 text-purple-accent',
		dot: '#6b6ebe',
		solid: 'bg-purple-accent'
	},
	'': {
		text: 'text-gray-600',
		bg: 'bg-gray-50',
		border: 'border-gray-300',
		chip: 'border-gray-300 bg-gray-100 text-gray-600',
		dot: '#94a3b8',
		solid: 'bg-gray-500'
	}
};

export const statusColors: Record<
	statusType,
	{ text: string; bg: string; border: string; chip: string }
> = {
	completed: {
		text: 'text-lime-accent',
		bg: 'bg-lime-accent/5',
		border: 'border-lime-accent/80',
		chip: 'bg-lime-accent/10 text-lime-accent'
	},
	inprogress: {
		text: 'text-purple-accent',
		bg: 'bg-purple-accent/5',
		border: 'border-purple-accent/40',
		chip: 'bg-purple-accent/10 text-purple-accent'
	},
	scheduled: {
		text: 'text-gray-600',
		bg: 'bg-gray-100',
		border: 'border-gray-300',
		chip: 'bg-gray-100 text-gray-600'
	}
};
