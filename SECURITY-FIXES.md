# Security Fixes in the `secured/` Version

## 1) Safe Note Rendering (Fix for XSS)
### What was changed
- Replaced note rendering logic that used `innerHTML` with DOM node creation (`createElement`) and `textContent`.

### Why this improves security
- `textContent` treats user input as plain text, not executable HTML.
- Payloads like `<img ... onerror=...>` are displayed as text and do not execute JavaScript.

## 2) Removed Misleading Client-side Authorization Claims
### What was changed
- The admin page is now framed as educational content, not true restricted content.
- Comments/UI explicitly state that real authorization must be enforced by a backend.

### Why this improves security understanding
- Prevents students from incorrectly treating frontend role checks as real security.
- Reinforces the principle that the client is an untrusted environment.

## 3) Reduced Sensitive Data Exposure
### What was changed
- Minimized directly exposed credential-related information in code structure.
- Kept only simple demo credentials required for local assignment behavior.

### Why this improves security
- Reduces accidental disclosure and encourages safer handling of secrets.

## 4) Added Basic Input Validation
### What was changed
- Added basic checks for note length and empty input.

### Why this improves security
- Validation improves reliability and reduces risky input patterns.
- It is not a complete security control but helps with safe coding hygiene.

## Remaining Limitations (No Backend)
Even after improvements, a frontend-only app cannot:
- securely protect secrets
- enforce real authentication/authorization
- prevent users from modifying client state in DevTools
- guarantee secure data ownership checks

A backend is required for true security guarantees.
