<script lang="ts">
  import Svg from 'san-webkit-next/ui/core/Svg'
  import type { ComponentProps } from 'svelte'

  let { ...props }: ComponentProps<Svg> = $props()
</script>

<Svg {...props}></Svg>
