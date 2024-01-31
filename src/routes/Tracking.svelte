<script lang="ts">
  import type { CurrentUserType } from 'webkit/stores/user'

  import { BROWSER } from 'esm-env'
  import { getCurrentUser$Ctx } from 'webkit/stores/user'
  import { updateAmplitude } from 'webkit/analytics/amplitude'
  import { startLinksListener } from 'webkit/analytics/links'

  const { currentUser$ } = getCurrentUser$Ctx()

  if (BROWSER) {
    startLinksListener()
    currentUser$.subscribe(setupAmplitude)
  }

  function setupAmplitude(user: CurrentUserType | null) {
    if (!user) return

    const { id, username, email } = user

    updateAmplitude(id, username, email)
  }
</script>
