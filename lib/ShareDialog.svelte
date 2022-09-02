<script context="module" lang="ts">import { dialogs } from 'san-webkit/lib/ui/Dialog';
import ShareDialog from './ShareDialog.svelte';
export const showShareDialog = props => dialogs.showOnce(ShareDialog, props);
const SOCIALS = [{
  id: 'twitter',
  href: (link, text) => `https://twitter.com/home?status=${text}%0Alink%3A%20${link}`
}, {
  id: 'facebook',
  href: link => `https://www.facebook.com/sharer/sharer.php?u=${link}`
}, {
  id: 'linked-in',
  href: (link, text, title) => `https://www.linkedin.com/shareArticle?mini=true&title=${title}&summary=${text}&source=santiment.net&url=${link}`
}, {
  id: 'telegram',
  href: (link, text) => `https://telegram.me/share/url?text=${text}&url=${link}`
}, {
  id: 'reddit',
  href: (link, text) => `https://reddit.com/submit?title=${text}&url=${link}`
}];</script>

<script lang="ts">import { copy } from 'san-webkit/lib/utils';
import 'san-webkit/lib/analytics';
import Dialog from 'san-webkit/lib/ui/Dialog';
import Svg from 'san-webkit/lib/ui/Svg/svelte';
import Toggle from 'san-webkit/lib/ui/Toggle.svelte';
export let title = 'Share';
export let data = {};
export let isAuthor = false;
const {
  title: shareTitle = 'Sanbase',
  text = 'Hey! Look what I have found at the app.santiment.net!',
  link = window.location.href
} = data;
const encodedTitle = encodeURIComponent(shareTitle);
const encodedText = encodeURIComponent(text);
const encodedLink = encodeURIComponent(link);
let isPublic = false;
let closeDialog;
let inputNode;

$: disabled = isAuthor && !isPublic;

let label = 'Copy link';

function onCopy() {
  label = 'Copied!';
  copy(link, () => label = 'Copy link', 1000, inputNode);
}</script>

<Dialog bind:closeDialog {...$$props} {title}>
  <div class="dialog">
    {#if disabled}
      <div class="note c-orange txt-m mrg-l mrg--b">
        Your watchlist is private. Please, switch it to "Public" first.
      </div>
    {/if}

    <div class="link border mrg-xl mrg--b row" class:disabled>
      <input readonly value={link} class="fluid c-waterloo" bind:this={inputNode} />
      <button class="copy btn nowrap txt-center" on:click={onCopy}>{label}</button>
    </div>

    Share on social media
    <div class="bottom row mrg-l mrg--t">
      {#each SOCIALS as { id, href }}
        <a
          href={href(encodedLink, encodedTitle, encodedText)}
          class="social btn-3 btn-2"
          class:disabled
          target="_blank"
          rel="noopener noreferrer">
          <Svg {id} w="18" h="20" />
        </a>
      {/each}

      {#if isAuthor}
        <button class="btn mrg-a mrg--l row v-center" on:click={() => (isPublic = !isPublic)}>
          {isPublic ? 'Public' : 'Private'}
          <Toggle isActive={isPublic} class="mrg-m mrg--l" />
        </button>
      {/if}
    </div>
  </div>
</Dialog>

<style>
  .dialog {
    width: 600px;
    padding: 20px 24px;
  }

  input {
    padding: 6px 10px;
    background: transparent;
    color: var(--waterloo);
  }

  .copy {
    padding: 10px 12px;
    border-left: 1px solid var(--porcelain);
    --color-hover: var(--green);
    border-radius: 0;
    min-width: 84px;
  }

  .link.disabled {
    background: var(--athens);
    color: var(--mystic);
    --waterloo: var(--mystic);
  }

  .social {
    width: 40px;
    height: 40px;
  }

  .bottom {
    gap: 12px;
  }

  .note {
    background: var(--orange-light-1);
    padding: 10px 16px;
  }
</style>
