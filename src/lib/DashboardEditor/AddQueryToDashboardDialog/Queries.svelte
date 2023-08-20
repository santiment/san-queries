<script lang="ts">
  import Profile from 'webkit/ui/Profile/svelte'
  import Svg from 'webkit/ui/Svg/svelte'

  export let onQueryAdd: (query: App.Dashboard.Query) => void

  const QUERIES = ['chart', 'table'] as App.Dashboard.Query[]
</script>

<queries class="column gap-s">
  {#each QUERIES as item}
    <query class="btn row v-center gap-s">
      <Profile
        class="c-fiord"
        user={{
          id: 0,
          username: 'brianq',
          avatarUrl:
            'https://production-sanbase-images.s3.amazonaws.com/uploads/b0491479eb1927335173d4fcfee35e04c79e357c33bb95aa5027320c47e471bc_1575478604555_1575478602965.jpeg',
        }}
        source="queries_add_query_to_dashboard"
        feature="query"
      />

      <div class="br mrg"></div>

      <article class="row v-center gap-s">
        <Svg id={item} w="12"></Svg>
        <span class="single-line">WETH borrowed on AAVE platform 22.03.22-22.03.23</span>
      </article>

      <button class="btn-2 mrg-a mrg--l" on:click={() => onQueryAdd(item)}>Add</button>
    </query>
  {/each}
</queries>

<style>
  query {
    height: 48px;
    border-radius: 8px;
    padding: 8px 12px;
    cursor: initial;
    --bg-hover: var(--athens);
    --img-size: 24px;
  }

  Profile {
    min-width: fit-content !important;
    --name-max-width: 100px;
  }

  .br {
    height: 24px;
    background: var(--mystic);
    width: 1px;
  }

  article {
    min-width: 0;
  }

  button {
    --bg: var(--white);
    --bg-hover: var(--white);
  }
</style>
