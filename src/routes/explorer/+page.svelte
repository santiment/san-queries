<script lang="ts">
  import { useObserve } from 'svelte-runes'
  import { tap } from 'rxjs'
  import Explorer from './Explorer.svelte'
  import { queryGetMostRecent, type TEntities } from './api'

  let items = $state.frozen([] as TEntities)

  useObserve(() => queryGetMostRecent()().pipe(tap((data) => (items = data.items))))
</script>

<Explorer {items}></Explorer>
