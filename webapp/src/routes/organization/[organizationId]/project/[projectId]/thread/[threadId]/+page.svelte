<script lang="ts">
  import ReplyCard from './ReplyCard.svelte';
  import Icon from '@iconify/svelte';
  import closeIcon from '@iconify/icons-mdi/close';
  import type { PageData } from './$types';
  import { onMount, tick } from 'svelte';
  import { apiService } from '$lib/apiService';
  import moment from 'moment';
  import { goto } from '$app/navigation';
  import { error } from '@sveltejs/kit';
  import DropdownMenu from '$lib/components/DropdownMenu.svelte';
  import ReplyTextEditor from './ReplyTextEditor.svelte';
  import ReplyDivider from './ReplyDivider.svelte';
  import ThreadUpdateTextEditor from './ThreadUpdateTextEditor.svelte';

  export let data: PageData;
  let thread = data.thread;
  let replies = thread.replies;
  let threadCreationTime: string;
  let editMode: boolean = false;

  onMount(() => {
    updateDate();
    setInterval(() => updateDate(), 60000);
  });

  const goBack = async () => {
    if (editMode) {
      editMode = false;
    } else {
      window.history.back();
    }
  };

  const updateDate = () => {
    threadCreationTime = moment.utc(thread.createdAt).fromNow();
  };

  const editThread = async () => {
    editMode = true;
    await tick();
  };

  const deleteThread = async (threadId: number) => {
    const response = await apiService.thread.deleteThread(data.organizationId, data.projectId, threadId);
    if (response.status === 200) {
      goto(`/organization/${data.organizationId}/project/${data.projectId}`);
    } else {
      error(response.status, 'Could not delete thread');
    }
  };

  const dropdownOptions = [
    { label: 'Edit', action: editThread },
    { label: 'Delete', action: () => deleteThread(thread.id) },
  ];
</script>

<div class="p-6 w-full max-w-6xl m-auto">
  <div class="bg-gray-800 rounded-lg relative">
    {#if editMode}
      <ThreadUpdateTextEditor bind:thread {goBack} organization={data.organization} projectId={data.projectId} />
    {:else}
      <div class="flex justify-between items-center mb-2 space-x-2">
        <h1 class="text-2xl font-bold">{thread.title}</h1>

        <div class="flex items-center">
          <DropdownMenu options={dropdownOptions} />
          <button on:click={goBack} class="text-gray-300 hover:bg-gray-700 rounded p-1 transition duration-200">
            <Icon icon={closeIcon} class="w-6 h-6" />
          </button>
        </div>
      </div>

      <p class="text-xs text-gray-300"><span class="font-bold">{thread.username}</span> {threadCreationTime}</p>
      <p class="mt-4">{@html thread.message}</p>
    {/if}
  </div>

  <ReplyDivider replyLength={replies.length} />

  <div>
    {#each replies as reply}
      <ReplyCard organization={data.organization} projectId={data.projectId} {reply} bind:replies />
    {/each}
  </div>

  <ReplyTextEditor bind:replies organization={data.organization} projectId={data.projectId} threadId={data.thread.id} />
</div>
