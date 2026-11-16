## Change

What changes and why. Link the issue or review finding (for example `S-01`).

## Verification

Commit, operating system and the commands you ran, with results. When GitHub CI is not available, run the `.github/workflows/ci.yml` steps locally and say what you did not run.

- [ ] `./tools/Test-RepoGuards.ps1 -Root . -Strict`
- [ ] Release build and `dotnet test`
- [ ] Text-template and server-type checks
- [ ] Frontend tests of touched modules
- [ ] Package checks (`Test-Packages.ps1`, both consumer checks) when packaging or public API changed
- [ ] Provider tests (`Test-Provider.ps1`) when data access or migrations changed

## Checklist

- [ ] No reference to commercial packages, SSU, StartSharp or Serenity Pro
- [ ] User-visible texts localized in `en` and `tr`
- [ ] Docs updated (module README, `docs/host-contract.md`, `CHANGELOG.md`) when behaviour or setup changed
