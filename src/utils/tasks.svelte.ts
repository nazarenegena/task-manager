import type { taskObj, statusType, priorityType } from '../types/taskTypes';

const tasks = $state<taskObj[]>([]);
export function getTasks() {
	return tasks;
}

export const addTask = (
	task: string,
	status: statusType | '',
	priority: priorityType | '',
	todoCategory: string | '',
	todoDescription: string | '',
	todoDate: string | ''
) => {
	tasks?.push({
		id: crypto.randomUUID(),
		title: task,
		status: status,
		priority: priority,
		category: todoCategory,
		description: todoDescription,
		date: todoDate
	});
	console.log(tasks, 'the tasks');
};

export const editTask = (
	id: string,
	newTitle: string,
	newPriority: priorityType | '',
	newCategory: string | '',
	newDescription: string | '',
	newTodoDate: string | ''
) => {
	const task = tasks?.find((t) => t.id === id);
	if (task) task.title = newTitle;
	if (task) task.priority = newPriority;
	if (task) task.category = newCategory;
	if (task) task.description = newDescription;
	if (task) task.date = newTodoDate;
	return task;
};

export const deleteTask = (id: string) => {
	const index = tasks.findIndex((t) => t.id === id);
	if (index !== -1) tasks.splice(index, 1);
};
