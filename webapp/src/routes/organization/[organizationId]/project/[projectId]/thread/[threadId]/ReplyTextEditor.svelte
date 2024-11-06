<script lang="ts">
  import type { ReplyCreateDTO } from '$shared/types/ReplyCreateDTO';
  import type { ReplyResponseDTO } from '$shared/types/ReplyResponseDTO';
  import { onMount } from 'svelte';
  import { TextEditor } from '$lib/TextEditor';
  import { apiService } from '$lib/apiService';
  import type { OrganizationDTO } from '$shared/types/OrganizationDTO';

  export let organization: OrganizationDTO;
  export let projectId: number;
  export let threadId: number;
  export let replies: ReplyResponseDTO[];
  let textEditor: TextEditor;
  let anonymous: boolean;

  onMount(() => {
    textEditor = new TextEditor('#textEditor', organization.members);
  });

  const submitReply = async () => {
    const { delta, message, mentionedUserIds } = textEditor.getStructuredText();

    const dto: ReplyCreateDTO = {
      message: message,
      mentionedUserIds: mentionedUserIds,
      delta: delta,
      snippets: [],
      anonymous: anonymous,
    };

    const reply = await apiService.reply.postReply(organization.id, projectId, threadId, dto);
    const replyDTO: ReplyResponseDTO = reply.data;
    replies = [...replies, replyDTO];
    textEditor.setText('');
  };
</script>

<div class="mt-6 bg-gray-800 rounded-lg">
  <h2 class="text-lg font-semibold mb-2">Post a Reply</h2>
  <div id="textEditor" class="textEditor"></div>
  <div class="flex items-center mt-2">
    <input type="checkbox" bind:checked={anonymous} id="anonymousCheckbox" class="mr-2" />
    <label for="anonymousCheckbox" class="text-gray-400">Post as anonymous user</label>
  </div>
  <div class="flex justify-end">
    <button on:click={submitReply} class="mt-4 bg-blue-600 py-2 px-4 rounded-lg hover:bg-blue-500">
      Submit Reply
    </button>
  </div>
</div>
