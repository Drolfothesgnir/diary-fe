<script lang="ts">
  import moment from "moment";
  import type { EntrySchema } from "../types";

  export let entry: EntrySchema;
  export let onRemoveClick: () => void;
  export let onEditClick: () => void;
  export let onPinClick: () => void;

  let copied = false;
  let contentRef: HTMLPreElement;

  // Function to copy content
  const copyEntryContent = () => {
    try {
      navigator.clipboard.writeText(contentRef.innerHTML);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000); // Reset the copied state after 2 seconds
    } catch (e) {
      console.log(e);
    }
  };
</script>

<li class="entry">
  <header>
    <h4>{moment.utc(entry.created_at).local().format("LLLL")}</h4>
  </header>

  <span class="divider"></span>

  <pre bind:this={contentRef}>{entry.content}</pre>

  <span class="divider"></span>

  {#if entry.updated_at}
    <span class="updatedAt">
      Updated at: {moment.utc(entry.updated_at).local().format("LLLL")}
    </span>
  {/if}

  <footer class="entryFooter">
    <div class="buttons">
      <button on:click={onRemoveClick} class="deleteButton">
        Remove entry
      </button>
      <button class="editButton" on:click={onEditClick}> Edit entry </button>
      <button on:click={copyEntryContent} class="copy {copied ? 'copied' : ''}">
        {copied ? "Copied!" : "Copy"}
      </button>
      <button
        on:click={onPinClick}
        class="pinButton {entry.pinned ? 'pinned' : ''}"
      >
        {entry.pinned ? "Unpin" : "Pin"}
      </button>
    </div>
  </footer>
</li>

<style lang="scss">
  @use "./scss/colors.scss" as colors;

  .entry {
    border: 5px solid #c4e7d4;
    border-radius: 10px;
    padding: 1rem;
    background-color: #fff8dc;
    color: #4f4f4f;
    margin-bottom: 10px;

    .divider {
      background-color: colors.$main;
      width: 100%;
      display: block;
      height: 1px;
      margin: 10px 0;
    }

    pre {
      font-family: "Georgia Regular";
      text-wrap: wrap;
    }

    .entryFooter {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .buttons {
        button {
          padding: 5px 10px;
          border-radius: 6px; /* Округлённые углы */
          transition:
            background-color 0.3s ease,
            color 0.3s ease; /* Плавный переход */
          border: none;

          & + button {
            margin-left: 10px;
          }

          &.deleteButton {
            background-color: #ffcccb;
            color: #8b0000;
          }

          &.editButton {
            background-color: #e6e6fa;
            color: #4b0082;
          }

          /* Состояние до нажатия */
          &.copy {
            background-color: #e6e6fa; /* Светло-лавандовый фон */
            color: #4f4f4f; /* Тёмно-серый текст */

            &.copied {
              background-color: #98fb98; /* Светло-зелёный фон */
              color: #006400; /* Тёмно-зелёный текст */
            }

            &:hover {
              background-color: #add8e6; /* Светло-голубой при наведении */
              cursor: pointer;
            }
          }

          &.pinButton {
            background-color: #ffcc80;
            border: 1px solid #ffb74d;

            &:hover {
              background-color: #ffa726;
              color: #fff;
            }

            &.pinned {
              background-color: #81c784; /* Светло-зелёный для прикреплённых записей */
              border: 1px solid #66bb6a;

              &:hover {
                background-color: #4caf50;
              }
            }
          }
        }
      }
    }
    .updatedAt {
      display: block;
      font-size: 14px;
      margin-bottom: 10px;
    }
  }
</style>
