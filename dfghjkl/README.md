# SOUL Radiology — Report Understanding Portal
**Compliant with SFIC Theme 03 Brand & UI Kit Specification**

A clean, card-based web interface designed for individuals and patients (not doctors) to access radiology reports, understand structured findings, and review plain-language explanations.

---

## 🎨 Color System & Tokens (from Brand Kit PDF)

| Token Name | Hex Code | Purpose in Portal |
|---|---|---|
| `brand.navy` | `#17365D` | Primary headers, wordmark, primary buttons (`.btn-primary`), navigation |
| `brand.teal` | `#13836B` | Secondary actions (`.btn-teal`), selected states, positive status, wordmark "Radiology" |
| `brand.saffron` | `#F3A536` | Subtle accents, notification highlights |
| `text.primary` | `#1F2937` | Main readable body copy |
| `text.muted` | `#5B6573` | Supporting metadata, field labels, dates |
| `surface.page` | `#F5F7FA` | Clean page background |
| `surface.card` | `#FFFFFF` | Report cards, dialogs, form cards |
| `border.default` | `#D9E1EA` | Dividers, card borders, form input borders |
| `surface.teal-soft` | `#E8F5F1` | Plain-language cards, available username pills |
| `surface.blue-soft` | `#EAF0F8` | Information summaries, active filter highlights |
| `surface.amber-soft` | `#FFF5E3` | "For clinician review" panels, account not found alerts |
| `status.error` | `#B42318` | Error states, duplicate username warnings |
| `status.success` | `#16794B` | Confirmed successful actions |

---

## 🚀 Implemented Features

### 1. User Login (For Users / Patients, Not Doctors)
- **Credentials:** Accepts **Username or Email ID** alongside **Password**.
- **Account Non-Existence Redirect:**
  If an unregistered identifier is entered, an amber notification displays:  
  `"No account found for '[identifier]'. Redirecting to Sign Up in 3s..."`  
  A timer auto-redirects the user to the Sign Up wizard and carries over the entered email/name.
- **Quick Test Accounts (Click to Fill):**
  - `Aarav Patel` (`aarav_p` / `Password@123`)
  - `Meera Sen` (`meera_sen` / `Password@123`)
  - `Rohan Gupta` (`rohan_g` / `Password@123`)

### 2. Multi-Card Sign Up Wizard
- **Card 1: Personal Details:**
  - Full Name
  - Date of Birth (DOB)
  - Gender selection chips (Female, Male, Other, Prefer not to say)
  - Mobile Number (10-digit validation)
  - Email ID (duplicate check against registered users)
  - "Next: Choose Username →" advances to Card 2.
- **Card 2: Username & Password:**
  - Summary banner with Card 1 information.
  - **Username (Unique for each user):**
    - Live debounced uniqueness check (`✓ Available` in green `#16794B` or `✕ Already taken` in red `#B42318`).
    - Smart username candidate suggestions generated from the user's name entered in Card 1.
  - Password & Confirm Password verification.
  - Registers the user and automatically logs them into the portal.

### 3. Home Page & Top-Right Navbar User Profile
- **Top Right Corner of Navbar:**
  - Displays user avatar circle with custom initials, Full Name, and unique handle (`@username`).
  - Interactive dropdown showing verified email, User ID (`SOUL-UID-xxxx`), DOB, Gender, Mobile Number, and a Sign Out button.
- **Clean, Non-Texty Report Cards:**
  - Clear banner stating: **"Synthetic Examples: Predefined demo reports & matching analyses"**.
  - Small set of synthetic radiology reports with:
    1. **Unique Identifier** (e.g., `RAD-SAMPLE-01`)
    2. **Examination Type** (the 5 benchmark scenarios: `Chest Radiograph (PA View)` normal, `Right Knee MRI` mild finding, `Head CT` doctor-review alert, `Upper Abdomen Ultrasound` incomplete study, `Follow-Up Chest CT` compared with a prior report)
    3. **Body Region** (e.g., `Thorax / Lungs`, `Head / Brain`, `Abdomen & Pelvis`, `Spine`, `Knee`)
    4. **Sample Date** (e.g., `14 Oct 2026`, `11 Oct 2026`, etc.)
    5. **Original Written Report Text**
    6. **Predefined Matching Analysis** modal displaying:
       - Structured Findings (concise key-value rows)
       - Plain-Language Explanation (clear, easy to understand)
       - Amber "For clinician review" panel reminding the user to discuss the report with their primary physician.

---

## 💻 Running the Portal

```bash
# Start local server
node server.js
```
Open in browser: `http://localhost:3000`
Or open `index.html` directly.

---

## ➕ Added Features (merged from the React build)

- **Tricolour strip + accessibility bar:** text size (A- / A / A+), high contrast, language picker (English / हिन्दी / ಕನ್ನಡ demo). Choices are remembered.
- **Medical Terms page:** 20 plain-language words with search. Hindi / Kannada lines follow the language picker (demo translations, please verify).
- **Words Explained:** each analysis page lists the medical words found in its report.
- **Source tracing:** "Show in full report" on a finding highlights its sentence in the original report.
- **Report tools:** Copy summary, Print, View scan.
- **Scan Viewer (display only):** simple illustrations (chest, head, abdomen, knee) with zoom, invert and reset. Also opens uploaded images.
- **Upload page:** drag and drop or choose TXT, DOCX, PDF or image files, paste text, or load a sample. TXT and DOCX text is read in the browser; PDFs are shown for reference (paste the text). Report text is split into parts (Reason, Findings, Impression, Recommendation) and known words are explained. It does not analyse the report.
- **Login verification code** and a footer with quick links.
