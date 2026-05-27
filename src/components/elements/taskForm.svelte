<script lang="ts">
	import { taskStore } from '$lib/taskStore.svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Button from './button.svelte';
</script>

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
