export type statusType = 'completed' | 'scheduled' | 'inprogress';

export interface taskObj {
	id: string;
	description: string;
	status: statusType | '';
}
