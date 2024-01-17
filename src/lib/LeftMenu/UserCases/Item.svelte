<script lang="ts">
  import MenuItem from '../MenuItem.svelte'

  export let item: any

  $: link = getLink(item)

  function getLink(item: any) {
    return `/query/new?data=${encodeURIComponent(JSON.stringify(item))}`
  }
</script>

<MenuItem {link}>
  <a href={link} class="link-as-bg">
    {item.name}
  </a>
</MenuItem>
