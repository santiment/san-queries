<script lang="ts">
  import InputWithIcon from 'san-webkit/lib/ui/InputWithIcon.svelte'

  export let placeholder: string
</script>

<InputWithIcon {placeholder} autofocus icon="search" w="12" class="mb-3" on:input />
