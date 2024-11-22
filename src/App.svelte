<script lang="ts">
  import { onMount } from "svelte";
  import Router from "svelte-spa-router";

  import { addEntry, editEntry } from "./lib/store/allEntriesStore";
  import Editor from "./lib/components/Editor.svelte";
  import Home from "./routes/Home.svelte";
  import Pinned from "./routes/Pinned.svelte";
  import HelloWorld from "./routes/HelloWorld.svelte";
  import Header from "./lib/components/Header.svelte";
  import Main from "./lib/components/Main.svelte";
  import NewEntry from "./lib/components/NewEntry.svelte";
  import {
    closeEditor,
    editId,
    editorContent,
    EditorState,
    editorState,
    startNewEntry,
  } from "./lib/store/editorStore";
  import { location } from "svelte-spa-router";

  async function saveEntry(content: string) {
    if ($editorState === EditorState.NEW) {
      await addEntry(content, $location === "/pinned");
    } else if ($editorState === EditorState.EDIT && $editId !== null) {
      await editEntry($editId, content);
    }
    closeEditor();
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key.toLowerCase()) {
      case "т":
      case "n": {
        if ($editorState === EditorState.CLOSED) {
          e.preventDefault();
          startNewEntry();
        }
        break;
      }

      case "escape": {
        if ($editorState > EditorState.CLOSED) {
          closeEditor();
        }
        break;
      }

      default:
        break;
    }
  };

  onMount(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  const routes = {
    "/": Home,
    "/pinned": Pinned,
    "/hello_world": HelloWorld,
  };
</script>

<Header />
<Main>
  <Router {routes} />
</Main>
{#if $editorState > 0}
  <Editor
    initialContent={$editorContent}
    onContentSave={saveEntry}
    onCloseClick={closeEditor}
  />
{:else}
  <NewEntry onClick={startNewEntry} />
{/if}
