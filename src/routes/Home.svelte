<script lang="ts">
  import { onMount } from "svelte";
  import queryString from "query-string";
  import EntryList from "../lib/components/EntryList.svelte";
  import LoadMore from "../lib/components/LoadMore.svelte";
  import {
    entries,
    loadEntries,
    removeEntry,
    togglePinEntry,
    hasNext,
    initialFetch,
  } from "../lib/store/allEntriesStore";
  import { startEntryEdit } from "../lib/store/editorStore";
  import type { EntrySchema } from "../types";

  async function alterEntryPinnedField(entry: EntrySchema) {
    await togglePinEntry(entry.id, !entry.pinned);
  }

  type QueryParams = {
    page?: number;
    per_page?: number;
    pinned?: boolean;
    s?: string;
    sort?: string;
  };

  onMount(() => {
    const { page, per_page, pinned, s, sort } = queryString.parse(
      location.search
    ) as QueryParams;

    initialFetch(page, per_page, pinned, s, sort);
  });
</script>

<EntryList
  entries={$entries}
  onRemoveClick={removeEntry}
  onEditClick={startEntryEdit}
  onPinClick={alterEntryPinnedField}
/>
{#if $hasNext}
  <LoadMore onClick={() => loadEntries()} />
{/if}
