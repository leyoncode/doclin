<script lang="ts">
  import { apiService } from '$lib/apiService';
  import DropdownMenu from '$lib/components/DropdownMenu.svelte';
  import type { ReplyResponseDTO } from '$shared/types/ReplyResponseDTO';
  import { error } from '@sveltejs/kit';
  import moment from 'moment';
  import { onMount } from 'svelte';
  import ReplyUpdateTextEditor from './ReplyUpdateTextEditor.svelte';
  import type { OrganizationDTO } from '$shared/types/OrganizationDTO';

  export let replies: ReplyResponseDTO[];
  export let reply: ReplyResponseDTO;
  export let organization: OrganizationDTO;
  export let projectId: number;
  let replyCreationTime: string;
  let editMode = false;

  onMount(() => {
    updateDate();
    setInterval(() => updateDate(), 60000);
  });

  const editReply = () => {
    editMode = true;
  };

  const cancelEditMode = () => {
    editMode = false;
  };

  const deleteReply = async () => {
    const response = await apiService.reply.deleteReply(organization.id, projectId, reply.id);
    if (response.status === 200) {
      replies = replies.filter((replyDTO: ReplyResponseDTO) => replyDTO.id !== reply.id);
    } else {
      error(response.status, 'Could not delete thread');
    }
  };

  const dropdownOptions = [
    { label: 'Edit', action: editReply },
    { label: 'Delete', action: deleteReply },
  ];

  const updateDate = () => {
    replyCreationTime = moment.utc(reply.createdAt).fromNow();
  };
</script>

<div class="block py-4">
  {#if editMode}
    <ReplyUpdateTextEditor {organization} {projectId} bind:reply {cancelEditMode} />
  {:else}
    <div class="flex justify-between items-center">
      <div class="text-xs text-gray-300">
        <span class="font-bold">{reply.username}</span> • {replyCreationTime}
      </div>
      <div class="flex items-center space-x-2">
        <DropdownMenu options={dropdownOptions} />
      </div>
    </div>

    <p class="text-m text-gray-300 mt-2">{@html reply.message}</p>
  {/if}
</div>

<hr class="border-gray-700" />
