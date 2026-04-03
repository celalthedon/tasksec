# Reflection (Student Voice)

## 1) Why should we never fully trust client-side logic?
I learned that client-side code runs in the user's own browser, so the user can inspect it, change it, and bypass checks. That means anything sensitive (like permissions or protected data rules) cannot be trusted if it is only enforced in JavaScript on the frontend.

## 2) What security problems cannot be solved without a backend?
Without a backend, I cannot do real authentication, secure session validation, trusted role/permission checks, protected data access, or safe secret storage. A backend is needed to verify identity and enforce authorization in a trusted environment.

## 3) What did I learn from this task?
I learned how common vulnerabilities happen in simple apps, especially hardcoded credentials, localStorage-based auth, XSS from `innerHTML`, and IDOR. I also learned that secure coding improvements on the frontend are helpful, but they do not replace server-side security controls.
