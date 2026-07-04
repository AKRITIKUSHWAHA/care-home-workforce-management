# AS Care Home - Refactor Summary Document

This file outlines the comprehensive list of features implemented, modified, and verified to meet all requirements specified in the client requirement sheet.

---

## 📋 Table of Contents
1. [Care Planning & Care Notes (PCS Style)](#1-care-planning--care-notes-pcs-style)
2. [Rota Management Scheduled Hours](#2-rota-management-scheduled-hours)
3. [HR Templates & Job Descriptions](#3-hr-templates--job-descriptions)
4. [Policies & Training Compliance Matrix](#4-policies--training-compliance-matrix)
5. [Summary of Files Modified](#5-summary-of-files-modified)
6. [Compilation & Verification Status](#6-compilation--verification-status)

---

## 1. Care Planning & Care Notes (PCS Style)
* **Editable Contacts**: The resident details sidebar in the Care Plan view now supports full inline editing for power contacts when in editing mode:
  - **Doctor (GP)**
  - **Power of Attorney (POA)**
  - **Next of Kin (NOK)**
  - **Social Worker**
* **Refused Care Actions**: Added a `"Did the resident refuse care?"` Yes/No toggle in the Care Note submission form.
* **PCS-Style Dashboard Alerts**:
  - If a resident has refused care, or their care records have not been updated for **more than 4 hours**, their resident card displays a prominent **red alert badge / pulsing dot** indicating they are overdue.
  - Added a live **Recent Care Notes Feed** on the Care Planning dashboard. If a note represents care refusal, it displays with a thick red left border, red background tint, and a warning icon.
* **Carer Authoring & Behaviour shortcuts**:
  - Dynamically displays the logged-in carer author: `"Written by: John (Senior Carer)"`.
  - Added a quick shortcut button to log **Behaviour / ABC Charts** directly from the Care Note submission screen.

---

## 2. Rota Management Scheduled Hours
* **Actual Duration Calculations**: Refactored shift hour calculations in both the Manager's and Compliance Officer's Workload Check tabs. Instead of multiplying shifts by a static 8 hours (`shiftCount * 8`), the system now calculates hours based on the actual duration of the shift:
  - `8AM–2PM` & `2PM–8PM` = **6 hours**
  - `8AM–8PM` & `8PM–8AM` = **12 hours**
* **Weekly Summary Sidebar**: Added a **Weekly Workload Summary** sidebar in the weekly Rota Calendar view, showing the exact total scheduled hours for every employee on rota for that week.

---

## 3. HR Templates & Job Descriptions
* **Recruitment Templates**: Seeded the Document Automation Center with three custom templates:
  1. **Invitation for Interview Letter**
  2. **ID Verification Form** (with checks for Group 1 and Group 2b documents)
  3. **Offer of Employment Letter**
* **Job Descriptions**: Added the six standardized care home job descriptions:
  - **Manager**
  - **Team Leader**
  - **HCA Lead (Health Care Lead)**
  - **HCA (Health Care Assistant)**
  - **Cook**
  - **Domestic Housekeeper**
* Users can now select these templates, customize placeholders (like `{{employee_name}}` and `{{job_title}}`), and generate documents in the HR/Admin Document Center.

---

## 4. Policies & Training Compliance Matrix
* **Policies Compliance Tab**:
  - Lists core operational policies: Health & Safety, Safeguarding, GDPR, Whistleblowing, Infection Control.
  - **E-Signature flow**: Employees can click "Read & Sign", review the policy contents, check a declaration checkbox, and type their full name to e-sign the document.
  - **Compliance Report Grid**: Managers/Admins see an aggregated compliance matrix showing which staff members have signed which policies, alongside progress trackers and compliance percentages.
* **Training Matrix Tab**:
  - Renders a complete matrix of Employees vs Training modules (Medication, Moving & Handling, Fire Safety, Infection Control, Dementia Care).
  - Uses color-coded badges indicating current status: Completed (**Green**), In Progress (**Yellow**), Not Started (**Red**).
  - Managers can click any matrix cell to change the status, which immediately updates compliance percentages and metrics.
  - **Futuru.ai Portal**: Displays a prominent promotion card with a direct link to `https://futuru.ai/` for staff training.

---

## 5. Summary of Files Modified

### Core Context & Routes
* `src/context/AppContext.jsx`: Added compliance state variables and helper actions (`signPolicy`, `updateTrainingStatus`).
* `src/routes/index.jsx`: Mapped the `policies-training` route to the new dashboard for Admin, HR, Manager, Compliance Officer, and Employee roles.
* `src/utils/mockData.js`: Configured initial document templates, default policies, policy signatures, and training matrix statuses.

### Care Planning & Notes
* `src/modules/care-planning/components/CarePlanView.jsx`: Enabled inline editing for GP, POA, NOK, and Social Worker details.
* `src/modules/care-planning/components/CareNoteForm.jsx`: Integrated carer author display, care refusal toggles, and ABC Chart shortcut.
* `src/modules/care-planning/components/IconGridSelector.jsx`: Added a Behaviour tag shortcut.
* `src/modules/care-planning/CarePlanningDashboard.jsx`: Implemented red overdue alerts, cards, and red-highlighted care note feeds.

### Rota Calculations
* `src/modules/compliance/RotaManagement.jsx` & `src/modules/hr/RotaManagement.jsx`: Updated scheduled hours to calculate 6h/12h actual shift lengths.
* `src/modules/compliance/RotaCalendar.jsx`: Added the Weekly Workload sidebar summarizing employee hours.

### Sidebars & Views
* `src/modules/shared/PoliciesAndTraining.jsx` **[NEW]**: The policies compliance and training matrix dashboard.
* Sidebar menus modified to include the "Policies & Training" tab:
  - `src/config/sidebar/adminMenu.js`
  - `src/config/sidebar/hrMenu.js`
  - `src/config/sidebar/managerMenu.js`
  - `src/config/sidebar/complianceMenu.js`
  - `src/config/sidebar/employeeMenu.js`

---

## 6. Compilation & Verification Status
All modifications were successfully compiled using the production bundler:
```bash
vite v5.4.21 building for production...
✓ 1584 modules transformed.
rendering chunks...
dist/index.html                     1.93 kB
dist/assets/logo-DhbeE4qA.png     385.09 kB
dist/assets/index-p1h7uBIx.css    110.78 kB
dist/assets/index-BntONYu5.js   2195.96 kB
✓ built in 6.11s
```
The application builds cleanly without errors, and the Vite development server is running to display all views.
