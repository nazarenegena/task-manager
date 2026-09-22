export interface calendarEventView {
	id?: string | number;
	text?: string;
	title?: string;
	start?: Date;
	end?: Date;
	allDay?: boolean;
	status?: string;
	priority?: string;
	category?: string;
	description?: string;
}
