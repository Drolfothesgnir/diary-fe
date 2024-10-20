<script lang="ts">
  import { onMount } from "svelte";
  import {
    deleteEntry,
    getEntries,
    postEntry,
    putEntry,
  } from "./lib/utils/requests";
  import type { EntrySchema } from "./types";
  import EntryList from "./lib/EntryList.svelte";
  import Header from "./lib/Header.svelte";
  import Main from "./lib/Main.svelte";
  import NewEntry from "./lib/NewEntry.svelte";
  import Editor from "./lib/Editor.svelte";

  enum EditorState {
    CLOSED = 0,
    NEW = 1,
    EDIT = 2,
  }

  let entries: EntrySchema[] = [];
  let editorState: EditorState = EditorState.CLOSED;
  let editId: number | null = null;
  let editorContent = "";

  const refresh = () =>
    getEntries().then(({ items }) => {
      entries = items;
    });

  const createEntry = () => (editorState = EditorState.NEW);

  const editEntry = (entry: EntrySchema) => {
    editId = entry.id;
    editorState = EditorState.EDIT;
    editorContent = entries.find(({ id }) => id === editId)!.content;
  };

  const removeEntry = (id: number) => {
    deleteEntry(id).then(refresh);
  };

  const closeEditor = () => {
    editorState = EditorState.CLOSED;
    editId = null;
  };

  async function saveEntry(content: string) {
    if (editorState === EditorState.NEW) {
      const response = await postEntry(content);
      entries = [response.data].concat(entries);
    } else if (editorState === EditorState.EDIT && editId !== null) {
      const response = await putEntry(editId, content);
      const entriesCopy = entries.slice();
      const oldEntryIndex = entries.findIndex(({ id }) => id === editId);
      entriesCopy[oldEntryIndex] = response.data;
      entries = entriesCopy;
    }
    closeEditor();
  }

  onMount(() => {
    refresh();
  });
</script>

<Header />
<Main>
  <EntryList {entries} onRemoveClick={removeEntry} onEditClick={editEntry} />
</Main>
{#if editorState > 0}
  <Editor
    initialContent={editorContent}
    onContentSave={saveEntry}
    onCloseClick={closeEditor}
  />
{:else}
  <NewEntry onClick={createEntry} />
{/if}

<style lang="scss">
</style>
