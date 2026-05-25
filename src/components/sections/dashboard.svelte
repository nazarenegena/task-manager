<script lang="ts">
	import StatusCard from '../elements/statusCard.svelte';
	import Button from './../elements/button.svelte';
	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import SquarePen from '@lucide/svelte/icons/square-pen';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Check from '@lucide/svelte/icons/check';
	import Play from '@lucide/svelte/icons/play';
	import { taskStore } from '../../lib/taskStore.svelte';

	const priorityColors: Record<string, string> = {
		high: 'text-red-600',
		medium: 'text-amber-600',
		low: 'text-gray-400'
	};
</script>

<div class="flex items-center space-x-4">
	<LayoutDashboard class="text h-10 w-10 rounded-lg bg-lime-accent/15 p-2 text-lime-accent" />
	<div>
		<h1 class="text-2xl font-bold">Dashboard</h1>
		<h3 class="text-primary/60">Manage your tasks and stay productive</h3>
	</div>
</div>

<main class="my-20">
	<div>
		<div class="flex space-x-10">
			<StatusCard statusTitle="Total Tasks" taskCount={taskStore.tasks.length} />
			<StatusCard statusTitle="Completed" taskCount={taskStore.completedTasks} status="completed" />
			<!-- <StatusCard statusTitle="Scheduled" taskCount={scheduledTasks} status="scheduled" /> -->
			<StatusCard
				statusTitle="Inprogress"
				taskCount={taskStore.inprogressTasks}
				status="inprogress"
			/>
			<StatusCard
				statusTitle="High Priority"
				taskCount={taskStore.highPriorityTasks}
				priority="high"
			/>
		</div>

		<div
			class="my-10 flex justify-between gap-x-8 rounded-md border border-primary/15 px-6 py-4 shadow-md"
		>
			<input
				type="text"
				bind:value={taskStore.todo}
				placeholder={taskStore.editingId ? 'Edit task ...' : 'What needs to be done ?'}
				class="w-full rounded-3xl border-none focus:ring-2 focus:ring-lime-accent focus:outline-none"
			/>
			<div class="flex items-center justify-between gap-4">
				<ChevronDown
					class=" cursor-pointer"
					onclick={() => (taskStore.openDropdown = !taskStore.openDropdown)}
				/>
				<div class="flex items-center gap-2">
					{#if taskStore.editingId}
						<Button
							onclick={taskStore.cancelEdit}
							btnStatus="Cancel"
							className="px-6 bg-gray-200 text-gray-800"
						/>
					{/if}

					<Button
						onclick={taskStore.handleAdd}
						btnStatus={taskStore.editingId ? 'Save' : 'Add'}
						className="px-10 bg-primary text-secondary text-center"
					/>
				</div>
			</div>
		</div>
	</div>
	<!-- Descriptiondrop down -->

	{#if taskStore.openDropdown}
		<div class=" my-6 space-y-10 rounded-md border border-primary/15 px-6 py-6 shadow-md">
			<div class="space-y-4">
				<p class="text-primary/70">Description</p>
				<input
					type="text"
					bind:value={taskStore.todoDescription}
					placeholder="Add more details about your task ..."
					class="h-20 w-full rounded-lg border-primary/15 px-4 py-1 focus:ring-2 focus:ring-lime-accent focus:outline-none"
				/>
			</div>
			<div class="flex items-center space-y-2 space-x-10">
				<div class="relative flex flex-col">
					<p class="text-primary/70">Priority</p>

					<select
						bind:value={taskStore.priority}
						class="h-10 w-80 appearance-none rounded-md border-primary/15 px-4 py-1 focus:ring-1 focus:ring-lime-accent focus:outline-none"
					>
						<option value="">Select priority ...</option>
						<option value="low">low</option>
						<option value="medium">medium</option>
						<option value="high">high</option>
					</select>
				</div>
				<div>
					<p class="text-primary/70">Due Date</p>
					<input
						type="date"
						bind:value={taskStore.todoDate}
						class="h-10 w-80 rounded-md border-primary/15 px-4 py-1 focus:ring-2 focus:ring-lime-accent focus:outline-none"
					/>
				</div>
			</div>
			<div class="space-y-4">
				<p class="text-primary/70">Category</p>
				<input
					type="text"
					bind:value={taskStore.todoCategory}
					placeholder="e.g.., Work, Personal, Shopping"
					class="h-10 w-full rounded-md border-primary/15 px-4 py-1 focus:ring-2 focus:ring-lime-accent focus:outline-none"
				/>
			</div>
		</div>
	{/if}

	<div class="space-y-3">
		{#each taskStore.tasks as task (task?.id)}
			<div class="rounded-xl border border-gray-200 p-4 shadow-sm">
				<!-- Top row -->
				<div class="flex items-center gap-3">
					<!-- Check circle toggle -->
					{#if task.status === 'completed'}
						<button
							onclick={() => taskStore.updateTaskStatus(task.id, 'inprogress')}
							aria-label="Mark as in progress"
							class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-lime-accent"
						>
							<Check class="h-4 w-4 text-white" />
						</button>
					{:else}
						<button
							onclick={() => taskStore.updateTaskStatus(task.id, 'completed')}
							aria-label="Mark as completed"
							class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 border-gray-300 hover:border-gray-500"
						></button>
					{/if}

					<!-- Title or inline edit -->
					{#if taskStore.editingId === task.id}
						<input
							type="text"
							bind:value={taskStore.todo}
							placeholder="Edit task..."
							class="flex-1 rounded-md border border-primary/15 px-3 text-sm focus:ring-2 focus:ring-lime-accent focus:outline-none"
						/>
					{:else}
						<span
							class={task.status === 'completed'
								? 'flex-1 text-gray-400 line-through'
								: 'flex-1 text-primary'}
						>
							{task.title}
						</span>
					{/if}

					<!-- Start Task button -->
					<button
						onclick={() => taskStore.updateTaskStatus(task.id, 'inprogress')}
						aria-label="Start task"
						class={task?.status === 'inprogress' || task?.status === 'completed'
							? 'hidden'
							: 'cursor-pointer text-lime-accent hover:text-lime-accent/80'}
					>
						<Play class="h-4 w-4" />
					</button>

					<!-- Status badge -->
					{#if task.status === 'inprogress'}
						<span
							class="rounded-full bg-purple-accent/10 px-2.5 py-0.5 text-xs font-medium text-purple-accent"
						>
							In Progress
						</span>
					{:else if task.status === 'scheduled'}
						<span class="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
							Scheduled
						</span>
					{:else if task.status === 'completed'}
						<span
							class="rounded-full bg-lime-accent/10 px-2.5 py-0.5 text-xs font-medium text-lime-accent"
						>
							Completed
						</span>
					{/if}

					<!-- Edit -->
					<button
						onclick={() => taskStore.startEdit(task)}
						class="cursor-pointer text-gray-400 hover:text-primary"
					>
						<SquarePen class="h-4 w-4" />
					</button>

					<!-- Delete -->
					<button
						onclick={() => taskStore.deleteTask(task.id)}
						class="cursor-pointer text-gray-400 hover:text-red-600"
					>
						<Trash2 class="h-4 w-4" />
					</button>
				</div>

				<!-- Details rows -->
				{#if task.description || task.priority || task.category || task.date}
					{#if task.description}
						<p
							class={`mt-1 ml-9 truncate text-sm ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-500'}`}
						>
							{task.description}
						</p>
					{/if}
					<div
						class={`mt-0.5 ml-9 flex items-center gap-1.5 text-xs ${task.status === 'completed' ? 'text-gray-300' : 'text-gray-400'}`}
					>
						{#if task.priority}
							<span class="capitalize {priorityColors[task.priority]}">{task.priority}</span>
						{/if}
						{#if task.category}
							{#if task.priority}<span>•</span>{/if}
							<span>{task.category}</span>
						{/if}
						{#if task.date}
							{#if task.priority || task.category}<span>•</span>{/if}
							<span>{task.date}</span>
						{/if}
					</div>
				{/if}
			</div>
		{:else}
			<p class="text-gray-500">No tasks found!</p>
		{/each}
	</div>
</main>
