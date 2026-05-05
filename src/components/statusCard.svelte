
<!-- <script lang= "ts">
    let {children} = $props();
</script>
<div>
    {@render children()}
</div> -->

<script lang="ts">
    import type { todoObj } from '../types/taskTypes';
    interface statusCardProps {
      task: todoObj;
    }
    let {task}: statusCardProps = $props();
</script>
<div>
    <p>tasks count {task?.status}</p>
</div>
