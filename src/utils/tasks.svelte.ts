import type { taskObj, statusType } from '../types/taskTypes';

const tasks = $state<taskObj[]>([]);
export function getTasks() {
	return tasks;
}

export const addTask = (task: string, status: statusType | '') => {
	tasks?.push({
		id: crypto.randomUUID(),
		description: task,
		status: status
	});
};

export const editTask = (id: string, newTitle: string) => {
	const task = tasks?.find((t) => t.id === id);
	if (task) task.description = newTitle;
	return task;
};

export const deleteTask = (id: string) => {
	const index = tasks.findIndex((t) => t.id === id);
	if (index !== -1) tasks.splice(index, 1);
};
