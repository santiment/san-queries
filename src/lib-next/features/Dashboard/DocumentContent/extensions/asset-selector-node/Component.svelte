<script lang="ts">
  import AssetLogo from 'san-webkit-next/ui/app/AssetLogo'
  import { NodeViewWrapper } from 'tiptap-svelte-adapter'
</script>

<NodeViewWrapper class="relative inline-flex">
  <div class="flex gap-1 whitespace-nowrap rounded border px-1.5 center">
    <AssetLogo slug={'bitcoin'}></AssetLogo>
    <span class="overflow-hidden text-ellipsis capitalize">Bitcoin</span>
    <span class="uppercase text-waterloo">(BTC)</span>
  </div>
</NodeViewWrapper>
