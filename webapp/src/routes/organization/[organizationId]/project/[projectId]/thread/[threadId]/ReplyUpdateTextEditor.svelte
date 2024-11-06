<script lang="ts">
  import type { ReplyResponseDTO } from '$shared/types/ReplyResponseDTO';
  import { onMount } from 'svelte';
  import { TextEditor } from '$lib/TextEditor';
  import { apiService } from '$lib/apiService';
  import type { OrganizationDTO } from '$shared/types/OrganizationDTO';
  import type { ReplyUpdateDTO } from '$shared/types/ReplyUpdateDTO';

  export let organization: OrganizationDTO;
  export let projectId: number;
  export let reply: ReplyResponseDTO;
  export let cancelEditMode: () => void;
  let replyUpdateTextEditor: TextEditor;

  onMount(() => {
    replyUpdateTextEditor = new TextEditor('#replyUpdateTextEditor', organization.members);
    replyUpdateTextEditor.setContents(reply.delta);
  });

  const updateReply = async () => {
    const { delta, message } = replyUpdateTextEditor.getStructuredText();

    const dto: ReplyUpdateDTO = {
      message: message,
      delta: delta,
      snippets: [],
    };

    const response = await apiService.reply.updateReply(organization.id, projectId, reply.id, dto);
    reply = response.data;

    cancelEditMode();
  };
</script>

<div>
  <div id="replyUpdateTextEditor" class="textEditor"></div>
  <div class="flex justify-end">
    <button on:click={updateReply} class="mt-4 bg-blue-600 py-2 px-4 rounded-lg hover:bg-blue-500">
      Update Reply
    </button>
  </div>
</div>
