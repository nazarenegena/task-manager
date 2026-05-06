import type { todoObj, todoStatusType } from '../types/taskTypes';

const tasks = $state<todoObj[]>([]);
export function getTasks() {
	console.log(tasks, 'tasks');
	return tasks;
}

export const addTask = (todo: string, status: todoStatusType | '') => {
	tasks?.push({
		id: crypto.randomUUID(),
		todoTitle: todo,
		todoStatus: status
	});
};

export const editTask = (id: string, newTitle: string) => {
	const task = tasks?.find((t) => t.id === id);
	if (task) task.todoTitle = newTitle;
	console.log('edittodo', task);
	return task;
};

export const deleteTask = (id: string) => {
	const index = tasks.findIndex((t) => t.id === id);
	if (index !== -1) tasks.splice(index, 1);
};
