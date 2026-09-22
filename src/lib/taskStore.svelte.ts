import { browser } from '$app/environment';
import type { taskObj, statusType, priorityType } from '../types/taskTypes';
import { toISODate, fromISODate } from './dates';

const STORAGE_KEY = 'tasks';

function loadTasks(): taskObj[] {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as taskObj[];
		return parsed.map((t) => ({
			...t,
			// migrate legacy 'pending' status to 'scheduled'
			status: (t.status as string) === 'pending' ? 'scheduled' : t.status,
			date: new Date(t.date)
		}));
	} catch {
		return [];
	}
}

class TaskStore {
	// ── Task array ──
	tasks = $state<taskObj[]>(loadTasks());

	constructor() {
		if (browser) {
			$effect.root(() => {
				$effect(() => {
					localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
				});
			});
		}
	}

	// ── Form state ──
	editingId = $state<string | null>(null);
	openDropdown = $state(false);
	todo = $state('');
	todoDescription = $state('');
	priority = $state<priorityType | ''>('');
	todoCategory = $state('');
	todoDate = $state('');
	todoStartTime = $state('');
	todoEndTime = $state('');

	// ── Derived counts ──
	get completedTasks() {
		return this.tasks.filter((t) => t.status === 'completed').length;
	}
	get inprogressTasks() {
		return this.tasks.filter((t) => t.status === 'inprogress').length;
	}
	get scheduledTasks() {
		return this.tasks.filter((t) => t.status !== 'inprogress' && t.status !== 'completed').length;
	}
	get highPriorityTasks() {
		return this.tasks.filter((t) => t.priority === 'high').length;
	}

	getTask = (id: string) => this.tasks.find((t) => t.id === id);

	// ── CRUD ──
	addTask(
		title: string,
		status: statusType | '',
		priority: priorityType | '',
		category: string | '',
		description: string | '',
		date: Date,
		startTime: string | '',
		endTime: string | ''
	): taskObj {
		const newTask: taskObj = {
			id: crypto.randomUUID(),
			title,
			status: status as statusType,
			priority,
			category,
			description,
			date,
			startTime,
			endTime
		};
		this.tasks = [...this.tasks, newTask];
		return newTask;
	}

	editTask(
		id: string,
		newTitle: string,
		newPriority: priorityType | '',
		newCategory: string | '',
		newDescription: string | '',
		newTodoDate: Date,
		newStartTime: string | '',
		newEndTime: string | ''
	) {
		this.tasks = this.tasks.map((t) =>
			t.id === id
				? {
						...t,
						title: newTitle,
						priority: newPriority,
						category: newCategory,
						description: newDescription,
						date: newTodoDate,
						startTime: newStartTime,
						endTime: newEndTime
					}
				: t
		);
	}

	deleteTask = (id: string) => {
		this.tasks = this.tasks.filter((t) => t.id !== id);
	};

	syncFromCalendar(
		id: string,
		patch: {
			date: Date;
			startTime?: string;
			endTime?: string;
			title?: string;
			description?: string;
		}
	) {
		this.tasks = this.tasks.map((t) =>
			t.id === id
				? {
						...t,
						date: patch.date,
						startTime: patch.startTime ?? t.startTime,
						endTime: patch.endTime ?? t.endTime,
						title: patch.title ?? t.title,
						description: patch.description ?? t.description
					}
				: t
		);
	}

	// ── Status toggle ──
	updateTaskStatus = (id: string, newStatus: statusType) => {
		this.tasks = this.tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t));
	};

	// ── Save or add ──
	handleAdd = () => {
		if (!this.todo.trim()) return;

		if (this.editingId) {
			this.editTask(
				this.editingId,
				this.todo,
				this.priority,
				this.todoCategory,
				this.todoDescription,
				fromISODate(this.todoDate),
				this.todoStartTime,
				this.todoEndTime
			);
			this.editingId = null;
		} else {
			this.addTask(
				this.todo,
				'scheduled',
				this.priority,
				this.todoCategory,
				this.todoDescription,
				fromISODate(this.todoDate),
				this.todoStartTime,
				this.todoEndTime
			);
		}
		this.reset();
	};

	// ── Start editing ──
	startEdit = (task: taskObj) => {
		this.editingId = task.id;
		this.todo = task.title;
		this.todoDescription = task.description;
		this.priority = task.priority;
		this.todoCategory = task.category;
		this.todoDate = toISODate(task.date);
		this.todoStartTime = task.startTime;
		this.todoEndTime = task.endTime;
		this.openDropdown = true;
	};

	// ── Open blank form prefilled with a date (calendar "+ New Task") ──
	newTask = (date?: Date) => {
		this.editingId = null;
		this.reset();
		this.todoDate = toISODate(date ?? new Date());
		this.openDropdown = true;
	};

	// ── Cancel editing ──
	cancelEdit = () => {
		this.editingId = null;
		this.reset();
	};

	// ── Reset form ──
	private reset() {
		this.todo = '';
		this.todoDescription = '';
		this.priority = '';
		this.todoCategory = '';
		this.todoDate = '';
		this.todoStartTime = '';
		this.todoEndTime = '';
		this.openDropdown = false;
	}
}

export const taskStore = new TaskStore();
