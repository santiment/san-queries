<script lang="ts">
  import { VoteType, vote } from 'san-webkit/lib/api/vote'
  import Button from '$lib/ui/Button.svelte'
  import { cn } from '$lib/ui/utils'

  let { votes, votesFor }: { votes: { totalVotes: number; userVotes: number }; votesFor: any } =
    $props()

  function onClick() {
    vote(votesFor.id, VoteType.Dashboard).then(() => {
      votes.userVotes += 1
      votes.totalVotes += 1
    })
  }
</script>

<Button
  icon="rocket"
  onclick={onClick}
  class={cn('gap-1.5', votes.userVotes && 'fill-green text-green')}>{votes.totalVotes}</Button
>
