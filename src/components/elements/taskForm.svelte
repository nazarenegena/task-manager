<script lang="ts">
	import { taskStore } from '$lib/taskStore.svelte';
	import { CircleX } from '@lucide/svelte/icons';
	import Button from './button.svelte';
</script>

<div class="relative rounded-xl bg-white p-6 shadow-xl">
	<button
		type="button"
		aria-label="Close"
		onclick={taskStore.cancelEdit}
		class="absolute top-3 right-3 cursor-pointer rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500"
	>
		<CircleX class="h-6 w-6" />
	</button>

	<input
		type="text"
		bind:value={taskStore.todo}
		placeholder={taskStore.editingId ? 'Edit task ...' : 'What needs to be done ?'}
		class="w-full rounded-3xl border-none pr-8 focus:ring-2 focus:ring-lime-accent focus:outline-none"
	/>

	<div class="mt-5 space-y-4">
		<div class="space-y-2">
			<p class="text-primary/70">Description</p>
			<input
				type="text"
				bind:value={taskStore.todoDescription}
				placeholder="Add more details about your task ..."
				class="h-20 w-full rounded-lg border-primary/15 px-4 py-1 focus:ring-2 focus:ring-lime-accent focus:outline-none"
			/>
		</div>
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			<div class="flex flex-col gap-2">
				<p class="text-primary/70">Priority</p>
				<select
					bind:value={taskStore.priority}
					class="h-10 w-full rounded-md border-primary/15 px-4 py-1 focus:ring-1 focus:ring-lime-accent focus:outline-none"
				>
					<option value="">Select priority ...</option>
					<option value="low">low</option>
					<option value="medium">medium</option>
					<option value="high">high</option>
				</select>
			</div>
			<div class="flex flex-col gap-2">
				<p class="text-primary/70">Due Date</p>
				<input
					type="date"
					bind:value={taskStore.todoDate}
					class="h-10 w-full rounded-md border-primary/15 px-4 py-1 focus:ring-2 focus:ring-lime-accent focus:outline-none"
				/>
			</div>
			<div class="flex flex-col gap-2">
				<p class="text-primary/70">Start Time</p>
				<input
					type="time"
					bind:value={taskStore.todoStartTime}
					class="h-10 w-full rounded-md border-primary/15 px-4 py-1 focus:ring-2 focus:ring-lime-accent focus:outline-none"
				/>
			</div>
			<div class="flex flex-col gap-2">
				<p class="text-primary/70">End Time</p>
				<input
					type="time"
					bind:value={taskStore.todoEndTime}
					class="h-10 w-full rounded-md border-primary/15 px-4 py-1 focus:ring-2 focus:ring-lime-accent focus:outline-none"
				/>
			</div>
		</div>
		<div class="space-y-2">
			<p class="text-primary/70">Category</p>
			<input
				type="text"
				bind:value={taskStore.todoCategory}
				placeholder="e.g.., Work, Personal, Shopping"
				class="h-10 w-full rounded-md border-primary/15 px-4 py-1 focus:ring-2 focus:ring-lime-accent focus:outline-none"
			/>
		</div>
	</div>

	<div class="mt-6 flex justify-end gap-2">
		{#if taskStore.editingId}
			<Button
				onclick={taskStore.cancelEdit}
				btnStatus="Cancel"
				className="bg-gray-200 px-6 py-2 text-gray-800"
			/>
		{/if}
		<Button
			onclick={taskStore.handleAdd}
			btnStatus={taskStore.editingId ? 'Save' : 'Add'}
			className="bg-primary px-10 py-2 text-center text-secondary"
		/>
	</div>
</div>
