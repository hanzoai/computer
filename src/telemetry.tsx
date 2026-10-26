import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { startTags } from '@hanzo/event';
import { AnalyticsProvider, usePageview } from '@hanzo/event/react';

/** The one Hanzo Cloud telemetry front door: POST api.hanzo.ai/v1/event. */
const HOST = 'https://api.hanzo.ai';

/**
 * This site's project key, cloud project `computer`. A `pk-` is publishable: it
 * names the project an event is filed under and the tag set cloud serves, and
 * it mints no reader. @hanzo/event derives a key from the host only for the
 * hosts in its SITE_KEY table, and hanzo.computer is not one, so it is stated here.
 */
const KEY = 'pk-s8XPLmlsL5yZZmjmQy6ASJN6BK656Jbnnxzp_skDWlA';

/** The sites one visit can cross; GA4 keeps it one session across them. */
const DOMAINS = [
  'hanzo.ai',
  'docs.hanzo.ai',
  'hanzo.id',
  'hanzo.build',
  'platform.hanzo.ai',
  'hanzo.app',
  'hanzo.chat',
  'pay.hanzo.ai',
];

const Banner = lazy(() => import('./banner'));

function Pageview() {
  usePageview(useLocation().pathname);
  return null;
}

/**
 * The ad tags. `startTags` fetches this site's tag set from cloud (GA4 and the
 * Pixel are configuration there, never ids in this repo) and the consent rule
 * for this visitor's region, and loads only what consent allows.
 */
function Tags() {
  useEffect(() => startTags({ key: KEY, domains: [window.location.hostname, ...DOMAINS] }), []);
  return null;
}

/**
 * Telemetry for hanzo.computer, mounted once inside the router. The provider owns
 * the one @hanzo/event client: the first pageview, error capture and the unload
 * flush; <Pageview> adds one per route change. The stream is first party and runs
 * for every visitor; consent gates the third parties alone (startTags), and
 * <Banner> (@hanzo/ui's Consent) is the one banner that asks.
 */
export function Telemetry({ children }: { children: ReactNode }) {
  return (
    <AnalyticsProvider config={{ product: 'site', host: HOST, ingestKey: KEY }}>
      <Tags />
      <Pageview />
      {children}
      <Suspense fallback={null}>
        <Banner />
      </Suspense>
    </AnalyticsProvider>
  );
}
