<script lang="ts">
  import { clickhouseLanguageDefinition as clickhouse } from '@popsql/monaco-sql-languages'
  import Editor from '$lib/SQLEditor/index.svelte'

  let STORIES = [
    {
      title: 'Parameters',
      value: `{{arg1}} {{arg2}} {{arg3}}`,
      parameters: [{ key: 'arg1' }, { key: 'arg2' }, { key: 'arg3' }],
    },
  ] as any[]

  clickhouse.loader().then(({ language }) => {
    const { keywords, operators, builtinFunctions } = language

    STORIES.push({
      title: 'Operators',
      value: operators.join(' '),
    })

    STORIES.push({
      title: 'Keywords',
      height: 200,
      value: keywords.join(' '),
    })

    STORIES.push({
      title: 'Built-in Functions',
      height: 500,
      value: builtinFunctions.join(' '),
      options: {
        maxTokenizationLineLength: Infinity,
      },
    })

    STORIES = STORIES
  })
</script>

{#each STORIES as { title, height = 100, value, parameters, options }}
  <h2 class="h4">{title}</h2>
  <p>
    <Editor style="height:{height}px" {value} {parameters} {options} />
  </p>
{/each}

<style>
  p {
    display: flex;
  }
</style>
