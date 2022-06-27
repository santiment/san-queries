<script>
  let className = ''
  export { className as class }
</script>

<div class="row {className}">
  <div class="border fluid">
    <slot name="left" />
  </div>

  <div class="border right mrg-s mrg--l">
    <slot name="right" />
  </div>
</div>

<style lang="scss">
  .border {
    padding: 16px;
    min-width: 320px;
    min-height: 284px;
  }

  .right {
    max-width: 320px;

    :global(.scroll) {
      max-height: var(--max-height, 230px);
      overflow: auto;
      margin-right: -16px;
      padding: 24px 16px 0 0;
    }
  }
</style>
