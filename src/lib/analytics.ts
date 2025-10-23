import { createClient } from '@/lib/supabase/client'

export async function trackEvent(
  eventType: string,
  eventData: Record<string, any> = {},
  organizationId?: string
) {
  const supabase = createClient()

  await (supabase.from('analytics_events') as any).insert({
    event_type: eventType,
    event_data: eventData,
    organization_id: organizationId
  })
}

export function useAnalytics() {
  return {
    track: trackEvent,
    trackPageView: (page: string) => trackEvent('page_view', { page }),
    trackClick: (element: string) => trackEvent('click', { element }),
    trackFormSubmit: (form: string) => trackEvent('form_submit', { form })
  }
}
