<script lang="ts">
  import type { SearchFilterSchemeType } from './types'
  import Input from '$lib/ui/Input.svelte'
  import { Subject, debounceTime, distinctUntilChanged, map, tap } from 'rxjs'

  let {
    value,
    onChange,
  }: {
    value?: SearchFilterSchemeType['value']
    onChange: (value: SearchFilterSchemeType['value']) => void
  } = $props()

  type InputEvent = Event & { target: HTMLInputElement }
  const inputSubject = new Subject<InputEvent>()
  const oninput = (e: Event) => inputSubject.next(e as InputEvent)

  $effect(() => {
    const flow = inputSubject
      .pipe(
        debounceTime(700),
        map(({ target }) => target.value),
        distinctUntilChanged((_, current) => current === value),
        tap(onChange),
      )
      .subscribe()

    return () => flow.unsubscribe()
  })
</script>

<Input icon="search" iconSize="12" placeholder="Search for a value" {value} {oninput}></Input>
