<script>
  import { clickhouseLanguageDefinition as clickhouse } from '@popsql/monaco-sql-languages'
  import Editor from '$lib/SQLEditor/index.svelte'

  let keywords = []
  let operators = []
  let builtinFunctions = []

  clickhouse.loader().then(({ language }) => {
    keywords = language.keywords
    operators = language.operators
    builtinFunctions = language.builtinFunctions
  })

  const options = {
    maxTokenizationLineLength: Infinity,
  }
</script>

<h2 class="h4">Operators</h2>
<p style="height: 100px;">
  {#key operators}
    <Editor style="height:100px" value={operators.join(' ')} />
  {/key}
</p>

<h2 class="h4">Keywords</h2>
<p>
  {#key keywords}
    <Editor style="height:200px" value={keywords.join(' ')} />
  {/key}
</p>

<h2 class="h4">Built-in Functions</h2>
<p>
  {#key builtinFunctions}
    <Editor style="height:400px" value={builtinFunctions.join(' ')} {options} />
  {/key}
</p>

<style>
  p {
    display: flex;
  }
</style>
