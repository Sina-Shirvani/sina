# Ahmad Shirvani — Network & Systems Portfolio

Static GitHub Pages edition of Ahmad Shirvani's networking and systems engineering portfolio.

## Live site

https://sina-shirvani.github.io/sina/

## Content

- Network and systems engineering profile
- Verified professional experience and operational metrics
- Cisco, MikroTik, FortiGate, Windows Server, VMware, Veeam, and monitoring skills
- Enterprise networking and automation lab projects
- Education, training, languages, and contact links

The portfolio content is based on Ahmad's LinkedIn profile and keeps training courses distinct from vendor certifications.

## Automated portfolio checks

Use Node.js 24 LTS (CI pins 24.11.1). From the repository root:

```sh
npm ci
npx playwright install chromium
npm test
npm run test:report
```

On Linux, use `npx playwright install --with-deps chromium` to install browser system dependencies. The test runner starts a loopback-only server on port 4173 and serves the site under `/sina/`, matching the GitHub Pages URL structure. Stop any other process using that port before rerunning. If Playwright reports a missing executable after a dependency update, rerun the browser installation command.

Use `npm test -- --project=390x844` to rerun one viewport. External destinations are checked as link contracts, so CI does not depend on LinkedIn, GitHub, or a local mail client. The résumé test checks the served PDF signature and both browser downloads.

The **Portfolio checks** workflow runs on pull requests and pushes to `master`, and supports **Run workflow** once it is present on the default branch. It uses read-only repository permissions and does not deploy the site. The Playwright HTML report, failure screenshots and traces, and axe JSON attachments are available in the **portfolio-playwright-report** artifact for 14 days. Locally, reports are written to `playwright-report/` and failure artifacts to `test-results/`.

The axe check scans the page with both case studies expanded at each viewport. It attaches detected rules, impact, selectors, and remediation summaries to each test result. It is report-only so existing findings remain visible while functional regressions can block the check. A completed scan does not establish WCAG conformance. Review the axe attachments alongside manual keyboard, zoom, and assistive-technology testing.
