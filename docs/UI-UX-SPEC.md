# خدمة ثانوي — UI/UX Audit (Phase 1)

Status: audit (phase 1) plus the implemented design (see the end of this file). The audit text below describes the ORIGINAL v1.2 project.

## Files
| File | Lines | Role |
|---|---|---|
| index.html | 249 | 7 views, bottom nav, 9 dialogs |
| style.css | 85 | Green theme, minified, 4 media queries + print |
| app.js | 403 | Data layer, dashboard, students, attendance, reports, settings |
| plan.js | 472 | Servants and meeting plans (segments, assignments) |
| pdf.js / pdf-assets.js | 440 / 2 | Internal PDF engine and generated assets. DO NOT TOUCH |

## Data layer (frozen)
- STORAGE_KEY `khedmet-thanawy-v1`, DATA_VERSION 3
- `migrate()`, `loadData()`, `save()` in app.js (lines ~94-146)
- Extra keys written: `khedmet-thanawy-v1-premigration-v1`, `khedmet-thanawy-v1-corrupt-<ts>`
- Cross-tab sync via `storage` event and weekly meeting regeneration on `visibilitychange`

## Views (7)
- #dashboardView
- #studentsView
- #attendanceView
- #servantsView
- #plansView
- #reportsView
- #settingsView

## Dialogs (9)
- #studentDialog
- #studentDetailsDialog
- #extraMeetingDialog
- #meetingDetailsDialog
- #servantDialog
- #planMeetingDialog
- #templateDialog
- #askDialog
- #previewDialog

## Navigation
- `.bottom-nav` buttons use `data-view`; dashboard shortcuts use `data-go`; both call `go(view)` (app.js:180-181)
- A sidebar must reuse `go()` and the same `data-view` attributes. No new routing logic.

## Findings and risks
1. Current theme is green (`#173f35`); spec requires navy `#142D4E` with gold accent. Change only CSS variables and component rules.
2. style.css is minified into very long lines; redesign should rewrite it in readable form rather than patch it.
3. `nav-attendance` class exists in HTML with no CSS rule (spec asked to resolve HTML/CSS mismatches). It is the only one found.
4. JS builds markup with classes (`chip`, `chip boy`, `avatar gold`, `back-btn`, `status-select`...). Those class names must be kept or aliased.
5. View IDs (`dashboardView`...) are not referenced by id in JS; views toggle by `.view.active`. Keep that contract.
6. 147 element IDs in index.html; every ID referenced from JS must survive (list below).
7. No `manifest.webmanifest`, no service worker, no PWA meta beyond theme-color and viewport.
8. `assets/icon-192.png` is 192x209, not square, so it is invalid as a PWA icon. 512x512 does not exist. Source logo `logo-khedmet-thanawy-original.png` is 1254x1254 and can generate both sizes plus a maskable icon without distortion.
9. Cairo is loaded from Google Fonts via `@import`; no local font file, so offline PWA will fall back to Tahoma/Arial unless a font file is bundled (not available offline here).
10. `file://` cannot register a service worker. PWA works only on HTTPS or localhost. Direct `index.html` preview must keep working.
11. The attached README documents v1.2; spec docs should extend it, not replace it.

## HTML IDs (147)
`backupBtn`, `dashboardView`, `nextMeetingCard`, `totalStat`, `presentStat`, `absentStat`, `meetingsStat`, `gradeCards`, `lastMeetingDate`, `lastMeetingSummary`, `studentsView`, `addStudentBtn`, `studentSearch`, `genderFilter`, `gradeFilter`, `educationFilter`, `statusFilter`, `clearFiltersBtn`, `studentsCount`, `studentsList`, `attendanceView`, `meetingForm`, `meetingSelect`, `attendanceGrade`, `attendanceEducation`, `openExtraMeetingBtn`, `attendanceListTitle`, `allPresentBtn`, `allAbsentBtn`, `clearStatusBtn`, `attendanceRoster`, `attendanceCount`, `servantsView`, `addServantBtn`, `servantSearch`, `servantStatusFilter`, `servantSkillFilter`, `servantsCount`, `servantsList`, `plansView`, `plansListPane`, `newPlanMeetingBtn`, `planTabs`, `planMeetingsList`, `editTemplateBtn`, `planDetailPane`, `reportsView`, `exportCsvBtn`, `reportFrom`, `reportTo`, `reportGrade`, `applyReportBtn`, `reportMeetings`, `reportPresent`, `reportAbsent`, `reportRate`, `reportExcused`, `studentReportList`, `meetingsList`, `settingsView`, `exportBackupBtn`, `importBackupInput`, `resetDataBtn`, `studentDialog`, `studentForm`, `studentDialogTitle`, `closeStudentDialog`, `studentId`, `studentName`, `studentGender`, `studentPhone`, `studentPhoneOwner`, `studentEducation`, `studentGrade`, `studentBirth`, `studentAddress`, `studentNotes`, `studentActive`, `cancelStudentBtn`, `studentDetailsDialog`, `detailsName`, `closeDetailsDialog`, `studentDetailsContent`, `detailsCloseBtn`, `detailsEditBtn`, `extraMeetingDialog`, `extraMeetingForm`, `closeExtraDialog`, `extraMeetingDate`, `extraMeetingName`, `cancelExtraBtn`, `meetingDetailsDialog`, `meetingDetailsTitle`, `closeMeetingDetails`, `meetingDetailsContent`, `meetingDetailsCloseBtn`, `servantDialog`, `servantForm`, `servantDialogTitle`, `closeServantDialog`, `servantId`, `servantName`, `servantNameError`, `servantPhone`, `servantSkill`, `skillSuggestions`, `servantNotes`, `servantPhotoPreview`, `servantPhotoInput`, `servantPhotoRemove`, `servantActive`, `cancelServantBtn`, `planMeetingDialog`, `planMeetingForm`, `planMeetingTitle`, `closePlanMeeting`, `pmId`, `pmName`, `pmDate`, `pmStatus`, `pmStart`, `pmEnd`, `pmNotes`, `pmError`, `cancelPlanMeeting`, `templateDialog`, `templateForm`, `closeTemplate`, `templateText`, `templateReset`, `cancelTemplate`, `askDialog`, `askTitle`, `askMessage`, `askItems`, `askCancel`, `askOk`, `previewDialog`, `previewTitle`, `closePreview`, `previewPages`, `previewClose`, `previewPrint`, `previewShare`, `previewExport`, `printArea`, `toast`

## Proposed phase order
Per spec section 9: tokens and components, shell (sidebar + bottom nav), then Dashboard, Students, Attendance, Servants, Plans, Reports, Settings, dialogs, responsive and regression testing, then PWA.


---
## Implemented design (v1.3)

Approach: layered, low-risk. `style.css` kept (palette variables remapped to navy/gold); new `redesign.css` adds the design system, shell and component styles; new `ui.js` adds UI behaviour; business logic files are untouched.

| Area | Implementation |
|---|---|
| Tokens | Navy #142D4E, blue #315C86, gold #D4A64F, bg #F4F6FA, spacing/type/radius/shadow/focus variables in `:root` of `redesign.css` |
| Desktop shell | `aside#sidebar` on the right (>= 900px), collapsible, state saved in `localStorage` key `kt-ui-sidebar` (UI preference only, separate from data) |
| Mobile shell | Existing bottom nav, restyled, safe-area aware; used below 900px |
| Navigation | Sidebar buttons reuse `data-view` and the existing `go()`; `ui.js` wraps `go()` only to set the page title and guard unsaved attendance |
| Dashboard | New stat cards, quick actions, SVG attendance trend, grade cards (all values read from `db`) |
| Reports | SVG trend + grade comparison using the existing formula present / (present + absent) |
| Attendance | Status stays a colour-coded `<select>` (kept to avoid touching app.js); row border shows state; sticky save bar; dirty badge and confirms |
| Dialogs | Bottom sheet below 640px, sticky action bar, safe areas |
| Settings | Storage and app info, install card with fallback instructions |
| PWA | `manifest.webmanifest`, `service-worker.js` (stale-while-revalidate, versioned cache, same-origin only, never touches user data), icons generated from the original 1254x1254 logo |

Known limitations: Cairo is not bundled (falls back offline); attendance status is a select, not segmented buttons; charts re-render on resize but not on orientation-only changes in a hidden view; PWA install and standalone behaviour are untested on a real device.
