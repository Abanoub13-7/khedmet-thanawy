# Testing Checklist — نتائج فعلية

Environment: Chromium via Playwright 1.56 (headless Linux), pages served from a local static server (localhost). Viewport emulation only. No real Android device, no Lighthouse, no HTTPS host were available.

Legend: [x] executed and passed · [ ] NOT executed (do not assume it works)

## Data safety
- [x] STORAGE_KEY `khedmet-thanawy-v1` unchanged; 56 students / 17 meetings loaded identically after redesign and after reload
- [x] app.js data layer (`loadData`, `save`, `migrate`) not modified; pdf.js, pdf-assets.js, plan.js not modified
- [x] Backup export contains all students and attendance records
- [x] Restore round-trip returns the same counts
- [x] Old-format backup (no servants/settings/gender) restores and migrates to version 3
- [x] Reset: cancelling the first confirmation keeps data intact
- [ ] Reset full flow through both confirmations (not executed, to avoid wiping the test data)

## Students
- [x] Add, edit, details dialog
- [x] Search + grade filter combine (AND); clear filters
- [ ] Delete student; phone-number search with Arabic digits; gender/education/status filters individually

## Attendance
- [x] No automatic present/absent on open
- [x] Present/absent/excused saved; records correct
- [x] Unsaved-changes badge; confirm blocks grade change and navigation; badge clears after save
- [x] Grades stay independent in the same meeting (second grade saved without losing first)
- [x] Extra meeting creation; weekly meetings not duplicated after reload
- [ ] "All present/absent/clear" buttons (not clicked in tests)

## Servants and plans
- [x] Servant add, edit, delete (confirmation)
- [x] Open meeting plan; PDF preview renders canvases; PDF export produces a valid PDF file
- [ ] Servant assignment to a segment, segment reorder (drag and arrows), create/edit meeting, historical assignment kept after servant deletion, print, share

## Reports
- [x] Rate = present / (present + absent): 46 / (46 + 18) = 72%; excused excluded
- [x] Dashboard overall rate equals report rate for the same data
- [x] Trend and grade-comparison charts render; CSV export downloads

## Responsive (emulated viewports 320, 375, 430, 768, 1024, 1366, 1920)
- [x] No horizontal overflow in any of the 7 views at any width (with seeded attendance data)
- [x] Student and servant dialogs fit inside the viewport at all widths
- [x] Sidebar visible at 1024+ and 1366; bottom nav at 768 and below; collapse works and persists
- [x] Visually reviewed screenshots: desktop dashboard, mobile dashboard, mobile attendance, mobile reports, chart labels
- [ ] Touch-target sizes, colour-contrast ratios, full keyboard walkthrough, screen reader (not measured)
- [ ] Real phone rendering, safe-area/notch behaviour, landscape orientation

## PWA
- [x] Manifest loads; name, short_name, lang ar, dir rtl, standalone, colors, relative start_url/scope
- [x] Icons 192, 512, maskable 512 exist, are PNG and are square
- [x] Service worker registers on localhost; controls page after reload; cache `khedmet-thanawy-shell-v1` created (16 files)
- [x] Offline (network disabled): shell loads, students render, a new student can be created, localStorage untouched
- [x] SW update (v1 to v2): old cache removed, localStorage unchanged
- [x] Works from a subfolder (`/church/ts/`): scope resolves to that folder
- [ ] Install on a real Android device / emulator, standalone launch, native install prompt
- [ ] Lighthouse PWA audit
- [ ] HTTPS deployment, RTL and bottom nav inside installed standalone mode
- [ ] Console: only the Google Fonts request fails in the sandbox (no internet); no JavaScript errors were raised in any test run
