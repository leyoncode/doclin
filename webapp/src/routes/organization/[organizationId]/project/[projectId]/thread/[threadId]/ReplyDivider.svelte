<script lang="ts">
  export let replyLength: number;

  const getReplyCountText = (count: number) => {
    if (count > 1) {
      return `${count} replies`;
    } else {
      return `${count} reply`;
    }
  };
</script>

<div class="flex items-center mt-6">
  <div class="h-px bg-blue-500 flex-grow"></div>
  <p class="mx-2 text-lg text-blue-500">{getReplyCountText(replyLength)}</p>
  <div class="h-px bg-blue-500 flex-grow"></div>
</div>
