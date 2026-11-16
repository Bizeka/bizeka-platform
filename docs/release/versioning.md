---
status: active
scope: repository
version: 1
last_reviewed: 2026-11-16
---

# Versioning and publication

All six npm and NuGet modules currently share `0.1.3-alpha`. A local build or pack does not create a release. Keep the version unchanged while preparing this untagged development revision. Before issuing a new package, assign a new prerelease version consistently in every module `.csproj`, npm manifest, local peer dependency and lockfile, then run all release gates. Never replace an already published archive at the same version.

Use semantic versions: prereleases are `0.x.y-alpha.N` or `0.x.y-beta.N`; incompatible changes before 1.0 require explicit migration notes. The transition to `1.0.0-rc.N` and stable 1.0 requires the owner-approved public gate. Package IDs and registration keys are public API; change them only with migration guidance.

Publication order follows dependency direction: Extensions, DynamicForms, Todo, OnlineChat and Theme, then Demo. The last three independent modules may be reordered after their prerequisites. NuGet and npm versions must match for every module. CI builds and validates archives; this repository intentionally has no automatic publish-on-push action or registry credentials.

Before publication, the maintainer must review the changelog, license/provenance, strict audits, both operating-system builds, provider results and package-consumer smoke tests. Enable a private security reporting channel. Tag only the exact reviewed commit and publish its validated CI artifacts through the organization's authorized release process.

Packages declare the MIT license (`PackageLicenseExpression` in NuGet, `"license": "MIT"` in npm) and carry the full MIT `LICENSE` file; npm manifests are not private. The owner superseded the ADR 0001 gate for an alpha release on 2026-11-16. `tools/Test-Packages.ps1` asserts the MIT expression. Registry publication still needs the owner's registry keys (see `.github/workflows/release.yml`).
