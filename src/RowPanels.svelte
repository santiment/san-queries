<script>
  let className = ''
  export { className as class }
</script>

<div class="row {className}">
  <div class="border fluid">
    <slot name="left" />
  </div>

  <div class="border mrg-s mrg--l">
    <slot name="right" />
  </div>
</div>

<style>
  .border {
    padding: 16px;
    min-width: 320px;
    min-height: 284px;
  }
</style>
