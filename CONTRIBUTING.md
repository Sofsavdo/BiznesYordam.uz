# Contributing to BiznesYordam

Thanks for your interest! Please follow these steps:

1. Fork the repo and create a feature branch: `git checkout -b feature/awesome`
2. Install deps: `npm ci`
3. Lint and test locally: `npm run lint && npm test`
4. Commit using clear messages: `feat:`, `fix:`, `docs:` etc.
5. Open a PR to `main` with a concise description and screenshots if applicable.

## Code Standards
- TypeScript strict, ESLint clean, Prettier formatted
- Add/maintain tests; aim for ≥80% coverage
- Update docs (README/Swagger) when you change APIs

## Security
- Never commit secrets. Use environment variables and GitHub Secrets.
- Report vulnerabilities via SECURITY.md