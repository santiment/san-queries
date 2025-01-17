<script lang="ts">
  import type { TDataWidgetProps } from '../../schema/data-widget'

  import { onMount } from 'svelte'
  import { useDashboardCtx } from '$lib-next/dashboard/ctx'
  import type { ASSET_TWEETS_BLOCK_NODE } from '../schema'
  import Note from '../../utils/Note.svelte'
  import { useDataWidgetParameterOverrides } from '$lib-next/dashboard/ctx/data-widgets.svelte'

  import { useObserveFnCall } from 'san-webkit-next/utils'
  import { switchMap, tap } from 'rxjs'
  import Checkbox from 'san-webkit-next/ui/core/Checkbox'
  import { queryAssetTweets } from './api'
  import { useUiCtx } from 'san-webkit-next/ctx/ui'
  import { applyStyles } from 'san-webkit-next/ui/utils'

  let { data }: TDataWidgetProps<typeof ASSET_TWEETS_BLOCK_NODE> = $props()

  const { widget } = data
  const { id, settings } = widget

  const { ui } = useUiCtx()
  const { parameterOverrides } = useDataWidgetParameterOverrides(id, widget.data.inputs)
  const { dashboard } = useDashboardCtx.get()

  let assetTweets = $state.raw<any>({
    positive: { tweets: [] },
    negative: { tweets: [] },
  })

  const loadAssetInfo = useObserveFnCall<{ slug: string }>(() =>
    switchMap((variables) =>
      queryAssetTweets()(variables).pipe(tap((data) => (assetTweets = data))),
    ),
  )

  $effect(() => {
    const slug = parameterOverrides.$.slug || 'bitcoin'
    loadAssetInfo({ slug })
  })

  function toggleField(type: 'positive' | 'negative') {
    settings.$$.type = type
  }

  onMount(() => {
    // @ts-ignore
    if (window.__TWEET_HANDLE) return

    function handleSize(e: MessageEvent) {
      if (!e.origin.includes('twitter')) return
      const data = e.data?.['twttr.embed']
      if (!data) return

      if (data.method === 'twttr.private.resize') {
        const {
          height,
          data: { tweet_id },
        } = data.params[0]

        for (const tweetNode of document.querySelectorAll(`[data-tweet-id="${tweet_id}"]`)) {
          applyStyles(tweetNode as null | HTMLElement, { height: height + 'px' })
        }
      }
    }
    window.addEventListener('message', handleSize)

    // @ts-ignore
    window.__TWEET_HANDLE = true
    return () => {
      // @ts-ignore
      delete window.__TWEET_HANDLE
      window.removeEventListener('message', handleSize)
    }
  })
</script>

{#if dashboard.isEditable}
  <div class="flex-1 gap-3 rounded border border-dashed border-blue p-3 column">
    <Note class="border-red bg-red-light-1 fill-red">
      This widget is unstable and might be removed soon
    </Note>

    {@render visibleControl({ type: 'positive' })}
    {@render visibleControl({ type: 'negative' })}
  </div>
{:else}
  <section class="gap-2 column">
    {@render tweetType(widget.settings.$$.type)}
  </section>
{/if}

{#snippet visibleControl({ type }: { type: 'positive' | 'negative' })}
  <div class="flex gap-3">
    <div class="flex gap-2 border-r pr-3 center">
      Show {type}
      <Checkbox
        isActive={widget.settings.$$.type === type}
        onCheckedChange={() => toggleField(type)}
      ></Checkbox>
    </div>

    <div class="flex-1 gap-2 column"></div>
    {@render tweetType(type)}
  </div>
{/snippet}

{#snippet tweetType(type: 'negative' | 'positive')}
  {@render tweet(assetTweets[type].tweets[0]?.tweetId)}
{/snippet}

{#snippet tweet(tweetId: undefined | string)}
  {#if tweetId}
    <iframe
      id="twitter-widget-3"
      scrolling="no"
      frameborder="0"
      allowtransparency={true}
      allowfullscreen={true}
      class=""
      title="X Post"
      src="https://platform.twitter.com/embed/Tweet.html?dnt=true&amp;embedId=twitter-widget-3&amp;features=eyJ0ZndfdGltZWxpbmVfbGlzdCI6eyJidWNrZXQiOltdLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X2ZvbGxvd2VyX2NvdW50X3N1bnNldCI6eyJidWNrZXQiOnRydWUsInZlcnNpb24iOm51bGx9LCJ0ZndfdHdlZXRfZWRpdF9iYWNrZW5kIjp7ImJ1Y2tldCI6Im9uIiwidmVyc2lvbiI6bnVsbH0sInRmd19yZWZzcmNfc2Vzc2lvbiI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfZm9zbnJfc29mdF9pbnRlcnZlbnRpb25zX2VuYWJsZWQiOnsiYnVja2V0Ijoib24iLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X21peGVkX21lZGlhXzE1ODk3Ijp7ImJ1Y2tldCI6InRyZWF0bWVudCIsInZlcnNpb24iOm51bGx9LCJ0ZndfZXhwZXJpbWVudHNfY29va2llX2V4cGlyYXRpb24iOnsiYnVja2V0IjoxMjA5NjAwLCJ2ZXJzaW9uIjpudWxsfSwidGZ3X3Nob3dfYmlyZHdhdGNoX3Bpdm90c19lbmFibGVkIjp7ImJ1Y2tldCI6Im9uIiwidmVyc2lvbiI6bnVsbH0sInRmd19kdXBsaWNhdGVfc2NyaWJlc190b19zZXR0aW5ncyI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfdXNlX3Byb2ZpbGVfaW1hZ2Vfc2hhcGVfZW5hYmxlZCI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9LCJ0ZndfdmlkZW9faGxzX2R5bmFtaWNfbWFuaWZlc3RzXzE1MDgyIjp7ImJ1Y2tldCI6InRydWVfYml0cmF0ZSIsInZlcnNpb24iOm51bGx9LCJ0ZndfbGVnYWN5X3RpbWVsaW5lX3N1bnNldCI6eyJidWNrZXQiOnRydWUsInZlcnNpb24iOm51bGx9LCJ0ZndfdHdlZXRfZWRpdF9mcm9udGVuZCI6eyJidWNrZXQiOiJvbiIsInZlcnNpb24iOm51bGx9fQ%3D%3D&amp;frame=false&amp;hideCard=false&amp;hideThread=false&amp;id={tweetId}&amp;lang=en&amp;theme={ui
        .$$.isNightMode
        ? 'dark'
        : 'light'}&amp;widgetsVersion=2615f7e52b7e0%3A1702314776716&amp;width=100vw"
      style="position: static; visibility: visible; width: 100%; height: 225px; display: block; flex-grow: 1;"
      data-tweet-id={tweetId}
    ></iframe>
  {/if}
{/snippet}
