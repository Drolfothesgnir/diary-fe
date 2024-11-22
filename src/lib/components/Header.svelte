<script lang="ts">
  import { link, location } from "svelte-spa-router";

  // Svelte's reactive store subscription shorthand ($) for reactive variables
  $: currentPath = $location;

  const navLinks = [
    {
      path: "/",
      title: "All entries",
    },
    {
      path: "/pinned",
      title: "Pinned entries",
    },
    {
      path: "/hello_world",
      title: "Hello World!!",
    },
  ];
</script>

<header class="header">
  <nav>
    <ul>
      {#each navLinks as navLink}
        <li>
          <a
            href={navLink.path}
            class:current={currentPath === navLink.path}
            use:link
          >
            {navLink.title}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</header>

<style lang="scss">
  .header {
    padding: 1rem;
    color: #fff;
    background-color: #b3d4fc;
    display: flex;
    justify-content: center;

    nav {
      width: 50%;
      max-width: 600px;

      ul {
        list-style: none;
        display: flex;

        li {
          & + li {
            margin-left: 10px;
          }

          a {
            color: #333; /* Основной цвет текста ссылок */
            text-decoration: none; /* Убираем подчеркивание */
            padding: 10px 15px; /* Отступы для каждой ссылки */
            border-radius: 4px; /* Закругление углов */
            transition:
              background-color 0.3s ease,
              color 0.3s ease;

            &:hover {
              background-color: #f0f0f0; /* Фон при наведении */
              color: #007bff; /* Цвет текста при наведении */
            }

            &:active {
              background-color: #007bff; /* Фон активной ссылки */
              color: white; /* Цвет текста активной ссылки */
            }

            &.current {
              background-color: #0056b3; /* Темный фон для текущей страницы */
              color: white; /* Белый текст */
              font-weight: bold;
            }
          }
        }
      }
    }
  }
</style>
