<script lang="ts">
  import Actions from './Actions.svelte'

  let title = ''

  function onBlur(e: Event) {
    const node = e.currentTarget as HTMLElement
    const text = (node.textContent || '').trim()
    node.innerText = text
  }
</script>

<main class="column">
  <h1
    class="h4 txt-m mrg-s mrg--b"
    contenteditable="true"
    placeholder="Add your title here..."
    on:blur={onBlur}
  >
    {title}
  </h1>

  <p class="body-2" contenteditable="true" placeholder="Add description here..." on:blur={onBlur}>
    {title}
  </p>

  <Actions />
</main>

<style lang="scss">
  main {
    padding: 24px 24px 80px;
  }

  [contenteditable] {
    outline: none;

    &:empty::before {
      content: attr(placeholder);
      display: block;
      height: 100%;
      color: var(--waterloo);
    }
  }
</style>
