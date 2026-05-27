import type { taskObj, statusType, priorityType } from '../types/taskTypes';

class TaskStore {
	// ── Task array ──
	tasks = $state<taskObj[]>([]);

	// ── Form state ──
	editingId = $state<string | null>(null);
	openDropdown = $state(false);
	todo = $state('');
	todoDescription = $state('');
	priority = $state<priorityType | ''>('');
	todoCategory = $state('');
	todoDate = $state('');

	// ── Derived counts ──
	completedTasks = $derived(this.tasks.filter((t) => t.status === 'completed').length);
	inprogressTasks = $derived(this.tasks.filter((t) => t.status === 'inprogress').length);
	pendingTasks = $derived(this.tasks.filter((t) => t.status !== 'completed').length);
	highPriorityTasks = $derived(this.tasks.filter((t) => t.priority === 'high').length);

	// ── CRUD ──
	addTask(
		title: string,
		status: statusType | '',
		priority: priorityType | '',
		category: string | '',
		description: string | '',
		date: string | ''
	) {
		this.tasks.push({
			id: crypto.randomUUID(),
			title,
			status: status as statusType,
			priority,
			category,
			description,
			date
		});
	}

	editTask(
		id: string,
		newTitle: string,
		newPriority: priorityType | '',
		newCategory: string | '',
		newDescription: string | '',
		newTodoDate: string | ''
	) {
		const task = this.tasks.find((t) => t.id === id);
		if (!task) return;
		task.title = newTitle;
		task.priority = newPriority;
		task.category = newCategory;
		task.description = newDescription;
		task.date = newTodoDate;
	}

	deleteTask = (id: string) => {
		const index = this.tasks.findIndex((t) => t.id === id);
		if (index !== -1) this.tasks.splice(index, 1);
	};

	// ── Status toggle ──
	updateTaskStatus = (id: string, newStatus: statusType) => {
		const task = this.tasks.find((t) => t.id === id);
		if (task) task.status = newStatus;
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
				this.todoDate
			);
			this.editingId = null;
		} else {
			this.addTask(
				this.todo,
				'',
				this.priority,
				this.todoCategory,
				this.todoDescription,
				this.todoDate
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
		this.todoDate = task.date;
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
		this.openDropdown = false;
	}
}

export const taskStore = new TaskStore();
