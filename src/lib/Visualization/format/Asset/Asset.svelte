<script lang="ts">
  import AssetLogo from 'san-webkit-next/ui/app/AssetLogo'

  type TProps = { value: string }
  let { value: slug }: TProps = $props()
</script>

<a
  href="https://app.santiment.net/charts?slug={slug}"
  class="inline-flex items-center gap-2 hover:text-green"
  target="_blank"
>
  <AssetLogo {slug}></AssetLogo>
  {slug}
</a>
