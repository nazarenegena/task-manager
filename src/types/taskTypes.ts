export type todoStatusType = 'completed' | 'scheduled' | 'inprogress';

export interface todoObj {
	id: string;
	todoTitle: string;
	todoStatus: todoStatusType | '';
}
