<script>
  import Control from './Control.svelte'

  let value = 'Table'
</script>

<main class="row gap-m">
  <section class="options border column">
    <h2 class="body-2">Options</h2>

    <controls class="column gap-xl">
      <Control
        name="Visualization type"
        options={['Table', 'Chart']}
        {value}
        onUpdate={(updated) => (value = updated)}
      />
      <Control name="Column 0: Title" />
    </controls>
  </section>
</main>

<style>
  main {
    background: var(--white);
    border-radius: 6px;
    flex: 1;
    padding: 16px 24px;
  }

  .options {
    max-width: 280px;
    flex: 1;
  }

  h2 {
    padding: 16px;
    border-bottom: 1px solid var(--porcelain);
  }

  controls {
    padding: 24px 16px;
    overflow: auto;
    flex: 1;
  }
</style>
