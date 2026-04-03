# SafeNotes Assignment Report

## 1. Introduction
This coursework demonstrates how web application security can fail when developers rely only on client-side logic. I built a small frontend-only app called SafeNotes in two versions. The first version intentionally contains common vulnerabilities. The second version improves security-related coding practices while acknowledging that true security requires backend enforcement.

## 2. App Description
SafeNotes has five core pages:
- **Login page** (`index.html`) for demo user sign-in
- **Dashboard** (`dashboard.html`) showing session info and notes
- **Notes feature** allowing users to create and view notes
- **Profile page** (`profile.html`) for user information
- **Admin page** (`admin.html`) for restricted/admin-themed content

Both versions run by opening HTML files in a browser, with JavaScript handling UI behavior and `localStorage` for demo data.

## 3. Vulnerabilities

### VULN-1: Hardcoded credentials in JavaScript
- **Where it exists:** `vulnerable/app.js`, in the `users` array.
- **Why it is dangerous:** Anyone can inspect frontend code and discover credentials.
- **Attack enabled:** Unauthorized logins using exposed passwords and user details.

### VULN-2: Client-side authentication/authorization only
- **Where it exists:** `vulnerable/app.js`, login state and role are stored and trusted from `localStorage`.
- **Why it is dangerous:** Browser storage is fully controlled by the user.
- **Attack enabled:** Privilege escalation (e.g., changing role from user to admin through DevTools).

### VULN-3: Unsafe note rendering using `innerHTML`
- **Where it exists:** `vulnerable/app.js`, notes are appended directly with `innerHTML`.
- **Why it is dangerous:** Malicious HTML/JavaScript payloads can execute in the page context.
- **Attack enabled:** Stored Cross-Site Scripting (XSS), demonstrated with a harmless alert payload.

### VULN-4: IDOR (Insecure Direct Object Reference)
- **Where it exists:** `vulnerable/profile.html` + `vulnerable/app.js`, profile is loaded from `?id=` in URL without authorization.
- **Why it is dangerous:** Users can access other users' data by changing IDs.
- **Attack enabled:** Unauthorized data exposure (horizontal privilege abuse).

## 4. Exploit Demonstration
Two safe local exploits were demonstrated:
1. **Admin bypass through DevTools:** User modifies `localStorage` role to `admin` and loads `admin.html`.
2. **Stored XSS in notes:** User saves `<img src=x onerror="alert('XSS executed')">` and triggers alert when notes render.

Both demos are non-destructive and limited to local browser behavior.

## 5. Security Improvements
In the `secured/` version:
- Replaced unsafe `innerHTML` note rendering with `createElement` + `textContent`.
- Added basic note validation (required, bounded length).
- Avoided IDOR-style profile lookup by URL and only showed current demo user's profile.
- Removed misleading claims of secure client-side authorization; added explicit UI/code messaging that backend enforcement is required.
- Reduced sensitive exposure by minimizing directly embedded credential-like data structures.

## 6. Conclusion
This project shows that frontend-only security controls are useful for UX but not reliable for real protection. Client-side code can be inspected and modified, so robust security must be enforced on the server side. The secured version demonstrates better coding hygiene, but also clearly communicates the limits of a no-backend architecture.
