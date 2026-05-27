export type statusType = 'completed' | 'scheduled' | 'inprogress' | 'pending';
export type priorityType = 'high' | 'medium' | 'low';

export interface taskObj {
	id: string;
	title: string;
	description: string;
	category: string | '';
	status: statusType | '';
	priority: priorityType | '';
	date: string | '';
}
