# Portfolio measurement

## Current state

The GitHub Pages project serves the portfolio under /sina/. The home page declares that URL as canonical and uses fragments for sections. The browser found one inline script for UI behavior, no third-party analytics script, no verification tag, and no robots meta directive. The host-level robots.txt and existing project sitemap returned 404 before this change. The page has two résumé links, two email links, one LinkedIn link, 22 GitHub links of several types, and two Projects fragment links. The existing Playwright and axe workflow remains in place.

The proposed sitemap contains one canonical HTML page. It omits fragments, assets and the résumé, which remains publicly downloadable. A project-level robots.txt would not control the shared hostname. A sitemap is a discovery hint and does not guarantee indexing.

## Provider decision

| Provider | Cost and GitHub Pages fit | Traffic reporting | Conversion tracking and maintenance |
| --- | --- | --- | --- |
| Google Analytics 4 | Standard property has a free option. Runs from a browser tag on GitHub Pages. | Pageviews, acquisition, campaigns and country reporting. | Automatic file and outbound click measurement plus custom events. Requires a consent and configuration review, duplicate-event controls, and more ongoing settings. |
| Plausible Cloud | Hosted subscription after a trial. Starter is the solo tier. Confirm pricing before purchase. A browser tag works on GitHub Pages. | Pageviews, sources, campaign tags and country aggregates. | Native downloads, outbound clicks and custom goals. Named goals can keep the setup simple. Custom properties and API-backed reporting require a Business tier. |
| Cloudflare Web Analytics | Free. A manual beacon works without changing GitHub Pages DNS. | Pageviews, referrers, country breakdowns and performance. No UTM reporting. | No custom events or dedicated file/outbound click measurement, so it cannot answer the requested conversion questions by itself. |

Recommend Plausible Cloud if the user approves the subscription and privacy setup. Start with named goals and the native dashboard. Use GA4 as the no-subscription-cost option if consent controls and added setup are acceptable. No vendor was provisioned.

References: [GA4 enhanced measurement](https://support.google.com/analytics/answer/9216061), [GA4 custom events](https://support.google.com/analytics/answer/12229021), [Google consent mode](https://support.google.com/analytics/answer/10000067), [Plausible tiers](https://plausible.io/docs/subscription-plans), [Plausible custom goals](https://plausible.io/docs/custom-event-goals), [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/about/), [Cloudflare feature limits](https://developers.cloudflare.com/web-analytics/faq/).

## Search Console handoff

1. Sign into [Search Console](https://search.google.com/search-console/) and add the **URL prefix** property for `https://sina-shirvani.github.io/sina/`, including the trailing slash.
2. Select **HTML tag** and supply only the public verification meta tag. Do not share account credentials. The tag can be added to the homepage head after it is supplied, then published with approval.
3. Once the live source contains the tag, click **Verify** in Search Console. Keep the tag installed.
4. Inspect the canonical homepage with **URL Inspection**. Review the indexing status and Google-selected canonical where available. Submit `https://sina-shirvani.github.io/sina/sitemap.xml` under **Sitemaps** after deployment.
5. Under **Performance → Search results**, compare the last 28 days with the previous 28. Use Queries and Pages to inspect impressions, clicks, CTR and average position. Position is an aggregate, and some queries are omitted for privacy.

[Ownership verification](https://support.google.com/webmasters/answer/9008080) · [URL-prefix properties](https://support.google.com/webmasters/answer/10432366)

## Event contract awaiting approval

Names below are proposed Plausible goals. Configure one automatic pageview and disable automatic file and outbound events when installing the custom click goals, so a click is counted once. Use one activation handler per link, including keyboard activation. Do not read or send clicked URLs, link text, email addresses, PDF contents, or arbitrary query parameters as event properties. Use a fixed allowlist of project names for project breakdowns on a plan without custom properties.

| Requested metric | Trigger and tracked element | Provider event | Browser verification |
| --- | --- | --- | --- |
| portfolio_page_view | Initial canonical page load | Native pageview | One request on load. No extra pageview on fragment changes. |
| resume_download_click | Either résumé button | Resume Link Click | One event per activation. The PDF downloads independently. |
| github_profile_click | GitHub profile contact link | GitHub Profile Click | One event. Repository links are excluded. |
| linkedin_profile_click | LinkedIn contact link | LinkedIn Profile Click | One event. No profile URL in custom payload. |
| project_repository_click | Featured repository links, collection link, and individual project cards | Project Repository Click, plus fixed project label in the goal name where needed | One event for the selected project. Exclude source excerpts and evidence images. |
| email_contact_click | Either mailto link | Email Contact Click | One event with no email address. This is intent, not evidence of a sent message. |
| projects_section_click | Hero or menu link to the Projects section | Projects Section Click | One event. Scrolling and direct hash visits do not count. |

A résumé click measures interest, not a completed download or a lead. Before activation, use a staging property or intercepted requests to verify the event count and inspect the entire payload, including referrer and URL fields. Then confirm events separately in the provider dashboard. Verify that blocking the vendor leaves navigation, contact links and downloads functional.

## Reporting setup

Use the provider dashboard for visits, sources, countries, and click goals. Use Search Console separately for search impressions, search clicks, CTR, average position, and top queries. Compare the last 28 days with the prior 28 days. Keep a monthly summary with columns for period, visits, search impressions, search clicks, top queries, top sources, top countries, project clicks by goal, résumé clicks, and contact clicks. Leave unavailable values blank. Never add search clicks to visits or match search queries to individual visitors.

Use fixed, nonpersonal attribution tags:

| Sharing channel | Example query string |
| --- | --- |
| LinkedIn post | `?utm_source=linkedin&utm_medium=social&utm_campaign=portfolio` |
| LinkedIn recruiter message | `?utm_source=linkedin&utm_medium=outreach&utm_campaign=portfolio` |
| Job application | `?utm_source=job_application&utm_medium=application&utm_campaign=portfolio` |

Use the normal canonical URL in page metadata. Avoid recipient names, employer names, requisition numbers, and application identifiers in tags. Direct and unknown traffic can include private messages, stripped referrers, and untagged links. Blocking, consent choices, and low traffic make counts incomplete and trends noisy.

## Privacy gate

Before enabling any provider, confirm the operating jurisdiction, visitor scope, actual vendor settings, retention, processor terms, transfers, disclosure, and any consent requirement. Publish a plain-language analytics disclosure and hold collection off until an affirmative choice where required. A cookieless vendor description does not settle that review. Do not add ad features, session recording, identity stitching, or fingerprinting. Keep private API keys and credentials out of the static site and repository.

[Plausible data policy](https://plausible.io/data-policy) · [ICO storage and access guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-pecr-rules)

This branch contains no tracking script, verification tag, consent UI, or provider credentials. Dashboard data is unavailable until the accounts and approved collection are configured.
