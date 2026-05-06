import { createContext } from 'svelte';
import type { todoObj } from '../types/taskTypes';

export const [getTasksContext, setTasksContext] = createContext<todoObj[]>();
