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
  let page = 1;
  let perPage = 10;
  let hasNext = true;

  const loadEntries = async () => {
    const { items, has_next } = await getEntries(page, perPage);
    entries = entries.concat(items);
    hasNext = has_next;
  };

  const loadMore = async () => {
    await loadEntries();
    page += 1;
  };

  const createEntry = () => (editorState = EditorState.NEW);

  const editEntry = (entry: EntrySchema) => {
    editId = entry.id;
    editorState = EditorState.EDIT;
    editorContent = entries.find(({ id }) => id === editId)!.content;
  };

  const removeEntry = (id: number) => {
    deleteEntry(id).then(() => {
      entries = entries.filter((entry) => entry.id !== id);
    });
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

  async function alterEntryPinnedField(entry: EntrySchema) {
    const response = await putEntry(entry.id, undefined, !entry.pinned);
    const entriesCopy = entries.slice();
    const oldEntryIndex = entries.findIndex(({ id }) => id === entry.id);
    entriesCopy[oldEntryIndex] = response.data;
    entries = entriesCopy;
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key.toLowerCase()) {
      case "т":
      case "n": {
        if (editorState === EditorState.CLOSED) {
          e.preventDefault();
          createEntry();
        }
        break;
      }

      case "escape": {
        if (editorState > EditorState.CLOSED) {
          closeEditor();
        }
        break;
      }

      default:
        break;
    }
  };

  onMount(() => {
    loadEntries();
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });
</script>

<Header />
<Main>
  <EntryList
    {entries}
    onRemoveClick={removeEntry}
    onEditClick={editEntry}
    onPinClick={alterEntryPinnedField}
  />
  {#if hasNext}
    <div class="loadMore">
      <button on:click={loadMore}>Load more</button>
    </div>
  {/if}
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
  .loadMore {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 1rem;

    /* Стиль кнопки "Новая запись" */
    button {
      background-color: #b3d4fc; /* Светло-зелёный фон */
      color: #4f4f4f; /* Тёмно-серый текст */
      border: none; /* Без границы */
      padding: 10px 20px; /* Внутренние отступы для удобного размера кнопки */
      border-radius: 10px; /* Округлённые углы */
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Лёгкая тень */
      font-size: 16px; /* Размер текста */
      transition: background-color 0.3s ease; /* Плавный переход фона при наведении */

      &:hover {
        background-color: #90ee90; /* Более тёмный оттенок зелёного */
        cursor: pointer; /* Изменение курсора на указатель */
      }
    }
  }
</style>
