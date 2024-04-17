<script lang="ts">
  import { Subject, debounceTime, map, tap, distinctUntilChanged } from 'rxjs'
  import Input from '../../Input.svelte'
  import { type NumberFilterSchemeType } from './types'

  let {
    value,
    onChange,
  }: {
    value?: NumberFilterSchemeType['value']
    onChange: (value: NumberFilterSchemeType['value']) => void
  } = $props()

  let state = { ...value }

  type InputEvent = Event & { target: HTMLInputElement }
  const inputSubject = new Subject<InputEvent>()
  const oninput = (e: Event) => inputSubject.next(e as InputEvent)

  $effect(() => {
    const flow = inputSubject
      .pipe(
        tap(({ target }) => {
          state[target.dataset.id as 'min' | 'max'] = target.value
            ? parseFloat(target.value)
            : undefined
        }),
        debounceTime(700),
        map(() => Object.assign({}, state)),
        distinctUntilChanged(
          (_, current) => current.max === value?.max && current.min === value?.min,
        ),
        tap(onChange),
      )
      .subscribe()

    return () => flow.unsubscribe()
  })
</script>

<Input type="number" placeholder="Min" data-id="min" value={state.min} {oninput}></Input>

<Input type="number" placeholder="Max" data-id="max" value={state.max} {oninput}></Input>
