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
	todoDate = $state(new Date());
	todoStartTime = $state('');
	todoEndTime = $state('');

	// ── Derived counts ──
	get completedTasks() {
		return this.tasks.filter((t) => t.status === 'completed').length;
	}
	get inprogressTasks() {
		return this.tasks.filter((t) => t.status === 'inprogress').length;
	}
	get pendingTasks() {
		return this.tasks.filter((t) => t.status !== 'completed').length;
	}
	get highPriorityTasks() {
		return this.tasks.filter((t) => t.priority === 'high').length;
	}

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
  ) {
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
    }
    this.tasks = [...this.tasks, newTask];
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

	// ── Status toggle ──
	updateTaskStatus = (id: string, newStatus: statusType) => {
		this.tasks = this.tasks.map((t) =>
			t.id === id ? { ...t, status: newStatus } : t
		);
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
				this.toDate(this.todoDate),
				this.todoStartTime,
				this.todoEndTime
			);
			this.editingId = null;
		} else {
			this.addTask(
				this.todo,
				'',
				this.priority,
				this.todoCategory,
				this.todoDescription,
				this.toDate(this.todoDate),
				this.todoStartTime,
				this.todoEndTime
			);
			console.log(taskStore.tasks, 'the tasks');
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
		this.todoDate = this.toDate(task.date);
		this.todoStartTime = task.startTime;
		this.todoEndTime = task.endTime;
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
		this.todoDate = new Date();
		this.todoStartTime = '';
		this.todoEndTime = '';
		this.openDropdown = false;
	}

	private toDate(v: Date | string): Date {
		return v instanceof Date ? v : new Date(v);
	}
}

export const taskStore = new TaskStore();
