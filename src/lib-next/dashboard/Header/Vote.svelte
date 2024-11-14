<script lang="ts">
  import Button from 'san-webkit-next/ui/core/Button'
  import { cn } from 'san-webkit-next/ui/utils'
  import { VoteType, vote } from 'san-webkit/lib/api/vote'

  type TProps = { dashboardId: number; votes: { totalVotes: number; userVotes: number } }
  let { dashboardId, votes }: TProps = $props()

  function onClick() {
    vote(dashboardId, VoteType.Dashboard).then(() => {
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
