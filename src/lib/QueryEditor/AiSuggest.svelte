<script lang="ts">
  import { concat, delay, exhaustMap, filter, from, interval, of, switchMap, tap, zip } from 'rxjs'
  import Button from '$lib/ui/Button.svelte'
  import { useObserveFnCall } from '$lib/ui/utils/state.svelte'
  import { useChangeIndicatorCtx } from '$lib/ChangeIndicator'
  import { useQueryEditorCtx } from './ctx'
  import { queryGenerateTitleByQuery } from './flow/ai/api'

  const { queryEditor } = useQueryEditorCtx()
  const changeIndicatorCtx = useChangeIndicatorCtx()

  const onAiClick = useObserveFnCall<{ currentTarget?: HTMLButtonElement }>(() =>
    exhaustMap((event) =>
      of(event?.currentTarget?.nextElementSibling).pipe(
        filter((node): node is HTMLElement => !!node),
        tap((node) => (node.textContent = '')),
        tap((node) => node.classList.add('ai-typing-cursor')),

        switchMap((node) =>
          queryGenerateTitleByQuery()(queryEditor.sql.$).pipe(
            switchMap(({ title }) =>
              concat(
                zip(from(title), interval(80)).pipe(
                  tap(([letter]) => (node.textContent += letter)),
                ),

                of(null).pipe(
                  delay(1000),
                  tap(() => node.classList.remove('ai-typing-cursor')),
                  tap(() => (queryEditor.name.$ = title)),
                  tap(() => changeIndicatorCtx.emit.changed()),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  )
</script>

<Button
  class="ml-1"
  explanation="Ask AI to write the title based on your query"
  onclick={onAiClick}
>
  ✨
</Button>

<style lang="postcss">
  :global(.ai-typing-cursor) {
    pointer-events: none;

    &::after {
      content: '▌';
      display: inline-block;
      color: var(--casper);
      animation: opacity 1s infinite;
      margin-left: -7px;
    }
  }

  @keyframes opacity {
    0%,
    100% {
      opacity: 1;
    }

    50% {
      opacity: 0;
    }
  }
</style>
