# Security Policy

This project is a static site and does not require runtime secrets.

## Reporting

Use GitHub Private Vulnerability Reporting if it is enabled for the repository.
Otherwise, open an issue containing only non-sensitive reproduction details. Never
post credentials, private keys, access tokens, or private personal data in an issue.

## Repository Rules

- Do not commit `.env` files, credentials, private keys, or unpublished data.
- Treat all files under `content/` as public.
- Use HTTPS links in content files.
- Run `npm run audit` before deployment and review Dependabot pull requests.
- Revoke and rotate any credential immediately if it is committed accidentally.
