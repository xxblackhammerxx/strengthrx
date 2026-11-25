/**
 * Client-safe Google Analytics 4 configuration.
 *
 * COMPLIANCE-LOAD-BEARING. Google Analytics may run on exactly two kinds of
 * page: the homepage, and the ad landing pages in app/(landing). It must never
 * run on /get-started (health goals, lab history), on the clinical service
 * pages (/peptides, /hormone-therapy, /sexual-wellness, /weight-loss), on
 * login/signup, or in the portals. The privacy policy promises this in
 * Section 5; if you widen the list below, change that page in the same commit.
 */

/** Public measurement ID. Ships in the browser by design. */
export const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || 'G-N9DPELDX0Z'

/** True only for the homepage and the ad landing pages. */
export function isGa4AllowedPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  if (path === '/') return true
  if (path === '/book' || path.startsWith('/book/')) return true
  if (path.startsWith('/lp/')) return true
  return false
}

/**
 * Inline bootstrap, run before gtag.js loads.
 *
 * The App Router changes pages without a reload, so a tag loaded on the
 * homepage is still in memory after the visitor clicks through to
 * /get-started, and GA4 sends a page_view on every history change by itself.
 * `window['ga-disable-<ID>']` is Google's documented kill switch, checked on
 * every send. Defining it as a getter over the current URL means it is already
 * true by the time any event for a disallowed page could go out. There is no
 * effect to wait for and so no window in which a hit can slip through.
 *
 * Keep the allow-list here identical to isGa4AllowedPath above; the test in
 * tests/int/ga4-allowed-paths.int.spec.ts runs this script and compares them.
 */
export function ga4BootstrapScript(id: string): string {
  return `
(function(){
  function allowed(p){
    if(p.length>1)p=p.replace(/\\/+$/,'');
    return p==='/'||p==='/book'||p.indexOf('/book/')===0||p.indexOf('/lp/')===0;
  }
  try{
    Object.defineProperty(window,'ga-disable-${id}',{
      configurable:true,
      get:function(){return !allowed(window.location.pathname)},
      set:function(){}
    });
  }catch(e){window['ga-disable-${id}']=true;return;}
  window.dataLayer=window.dataLayer||[];
  function gtag(){window.dataLayer.push(arguments);}
  window.gtag=window.gtag||gtag;
  gtag('js',new Date());
  gtag('config','${id}',{allow_google_signals:false,allow_ad_personalization_signals:false});
})();`
}
