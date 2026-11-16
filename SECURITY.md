# Security policy

## Supported versions

| Version | Supported |
| --- | --- |
| 0.1.x (alpha) | Yes, latest 0.1.x release only |
| < 0.1.3-alpha | No |

The 0.1.x line is an alpha. No stable or production-certified version has been declared; a fix may require upgrading to the latest 0.1.x release.

## Reporting a vulnerability

Do not disclose exploitable issues, credentials or personal data in public issues. Report privately through GitHub private vulnerability reporting: **Security > Advisories > Report a vulnerability** ([direct link](https://github.com/Bizeka/bizeka-platform/security/advisories/new)). If that is not possible, email platform@bizeka.com.

Include the affected package and version, a minimal reproduction, the expected authorization boundary and the impact. Use synthetic data and redact tokens and connection strings. Do not test against third-party deployments without their permission. We aim to acknowledge reports within five working days; there is no guaranteed response SLA during the alpha period.

## Host responsibilities

These packages are modules, not an independently configured host. The consuming application owns authentication, authorization/permission registration, HTTPS, anti-forgery, CSP and other HTTP security headers, upload limits, logging redaction, database credentials and migration execution. Review those controls in a real host before deployment; library unit tests cannot certify HTTP headers.

Todo restricts task access to creators, assigning users and assignees. OnlineChat requires authenticated users, module permissions and current room membership; process-local presence does not provide multi-instance isolation. Redis backplane is unsupported. No package adds a general tenant/company boundary to an arbitrary consuming host; integrators must review their own tenancy contract before multi-tenant use.

## Dependency audit

Serenity 10.5.2 transitively required SixLabors.ImageSharp 2.1.13 with five advisories, which were suppressed during ordinary restore under a temporary owner exception. Serenity 10.6.3 no longer references ImageSharp (image processing moved to SkiaSharp, which the host supplies), so the suppressions are removed and `tools/Test-Dependencies.ps1`, which includes transitive packages, passes. Do not add audit suppressions.

Platform moved to Serenity 10.6.3 under [ADR 0003](docs/adr/0003-coordinated-serenity-upgrade.md) (owner approval 2026-11-16). Image upload behaviour now depends on the SkiaSharp version and native assets of each consuming host; verify it there.

Run the strict dependency audit and history secret scan before release. See [the public gate](docs/release/public-gate.md).
