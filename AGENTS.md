# AGENTS.md

Project: Frontend for Red Hat's Patch service (React + JavaScript + TypeScript + PatternFly React)

Backend: https://github.com/RedHatInsights/patchman-engine

## Dev environment setup
- Use `nvm use` to match node version in `.nvmrc`
- Run [script to patch your
   `/etc/hosts`](https://github.com/RedHatInsights/insights-proxy/blob/master/scripts/patch-etc-hosts.sh)
- Always be connected to Red Hat VPN

## Commit guidelines
- Follow Conventional Commits format: `type(scope): description`
- Common types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
- Explain the "why" in the commit message, not the "what".
- Keep commit message body no longer than 72 characters and header no longer than 50 characters