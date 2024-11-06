<script lang="ts">
  import Icon from '@iconify/svelte';
  import closeIcon from '@iconify/icons-mdi/close';
  import type { ThreadResponseDTO } from '$shared/types/ThreadResponseDTO';
  import { onMount } from 'svelte';
  import { TextEditor } from '$lib/TextEditor';
  import type { OrganizationDTO } from '$shared/types/OrganizationDTO';
  import type { ThreadUpdateDTO } from '$shared/types/ThreadUpdateDTO';
  import { apiService } from '$lib/apiService';

  export let thread: ThreadResponseDTO;
  export let goBack: () => void;
  export let organization: OrganizationDTO;
  export let projectId: number;
  let threadEditor: TextEditor;
  let title: string;

  onMount(() => {
    threadEditor = new TextEditor('#threadEditor', organization.members);
    threadEditor.setContents(thread.delta);
    title = thread.title;
  });

  const submitThread = async () => {
    const { delta, message } = threadEditor.getStructuredText();

    const data: ThreadUpdateDTO = {
      title: title,
      message: message,
      delta: delta,
      snippets: [],
    };

    const response = await apiService.thread.updateThread(organization.id, projectId, thread.id, data);
    thread = response.data;

    goBack();
  };
</script>

<div>
  <div class="flex justify-between items-center mb-2 space-x-2">
    <input
      bind:value={title}
      class="w-full text-2xl font-bold p-1 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none"
    />

    <div class="flex items-center">
      <button on:click={goBack} class="text-gray-300 hover:bg-gray-700 rounded p-1 transition duration-200">
        <Icon icon={closeIcon} class="w-6 h-6" />
      </button>
    </div>
  </div>

  <div id="threadEditor" class="textEditor"></div>

  <div class="flex justify-end">
    <button on:click={submitThread} class="mt-4 bg-blue-600 py-2 px-4 rounded-lg hover:bg-blue-500">
      Update Question
    </button>
  </div>
</div>
