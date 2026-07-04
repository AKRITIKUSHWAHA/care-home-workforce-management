# Care Planning Software - Client Requirements

## 1. Project Overview
- **Project Name:** Care Planning
- **Core Objective:** Develop a mobile-friendly software application that allows carers to view, review, and modify care plans, and submit care notes on the go.
- **Copyright Consideration:** The software's functionality should be inspired by the provided reference materials (PCS/MCM), but the **UI/UX must be uniquely designed** to avoid any copyright infringement issues.

## 2. Platform & Accessibility
- **Mobile-First Approach:** Must be fully responsive and functional on smartphones, as primary users will be accessing it via their mobile devices while delivering care.
- **User Accountability:** When staff go on their device and login, the system MUST automatically record and display exactly **who** is writing the care notes.

## 3. Core Features & Functionality

### 3.1 Care Plan Management (CQC Compliant)
- **Resident Profile Header:** 
  - Must include an option to put a **picture (profile photo)** of the resident.
- **Review & Notifications (Color Coding):** 
  - The overall care plan needs to show a notification/alert to be updated every **6 months**.
  - **Monthly Section Reviews:** Each individual section in the care plan must have an option to be reviewed on a monthly basis.
  - **Red Alert:** The color **Red** means "not updated" (overdue for review).
- **Professional & Family Contacts:** Must explicitly include dedicated sections/fields for:
  - Doctor
  - Power of Attorney (PoA)
  - Next of Kin
  - Social Worker
  - Advocates, Keyworkers, Friends & Family
- **15 Core CQC Sections:** Must cover Personal Profile, Communication, Mobility, Falls Risk, Personal Care, Continence, Nutrition, Medication, Skin Integrity, Mental Health, Dementia Care, Activities, Sleep, Health Conditions, End of Life.
- **Document Attachments:** Ability to attach paperwork specifically for Medication, Health, MCA (Mental Capacity Act), and DoLS (Deprivation of Liberty Safeguards).

### 3.2 Care Notes (Quick Entry System)
A core component is the ability to write care notes rapidly without extensive typing, utilizing an icon-based, tap-to-select interface.

- **Refused Care (Color Coding):**
  - **Red** color must be used to indicate a "Refused" care action on the care notes timeline.
- **Late Entry Feature:**
  - Dedicated "Late Entry" toggle/button with manual time input.
  - Dedicated text area for custom comments and context.
- ~~**Time Tracking:** Input field to record duration (How long has it taken you)~~ *(Removed as per client request)*.
- **Visual Status Selectors (Sliders/Buttons):**
  - **Level of help needed:** Options for 'None', 'Little', 'Fair amount', and 'A lot'.
  - **Happiness/Mood Tracker:** Emoji-based selections.

### 3.3 Quick-Select Categories & Icons
To minimize typing, the interface must include categorized grids of icons for common actions.
- **Categories:** Medical & Observations, Emotional Support & Behaviors, Sleep Monitoring, Interventions & Equipment Care, Processes & Administration.

### 3.4 Behaviour (ABC) Chart Option
A dedicated "Behaviour option" to log incidents. Must include the following data points (as per the provided ABC chart screenshot):
- Date & Time
- Duration
- Location
- Care Note summary
- Antecedent (What happened before)
- Behaviour (The actual behavior observed)
- Consequence (What happened after)
- Worker involved & Service User involved
- New behaviour (Yes/No toggle)
- Behaviour Category
- Intervention Used
- Restrictive Practice (if any)
- Incident (Yes/No)

## 4. Next Steps
- [x] Create initial mobile-friendly dashboard and Care Note form.
- [x] Remove the "duration" input from the Care Note form.
- [x] Build the 15-section CQC Care Plan Accordion layout.
- [ ] Add Profile Picture and Monthly Review functionality to Care Plans.
- [ ] Add the Professional Contacts section (Doctor, PoA, Social Worker, etc.).
- [ ] Implement color coding: Red for "Refused" notes and "Not Updated" plans.
- [ ] Build the Behaviour (ABC) Chart feature.
- [ ] Ensure Staff ID/Name is automatically attached to all notes.

---

## 5. Appendix: Raw Client Notes & Examples
The following is the exact example provided by the client regarding the expected detail for Care Plans. This must be remembered and referenced for future data mapping.

### Core Sections Every Care Plan Should Include
1. **Personal Profile:** Full name, Preferred name, DOB, GP details, Next of kin, Key contacts, Religion/culture, Preferred routines, Life history, Likes and dislikes.
2. **Communication:** Ability to communicate, Hearing/Vision difficulties, Language needs, Capacity to understand, Communication aids used.
3. **Mobility:** Independent/assisted, Walking aid, Falls history, Transfer method, Wheelchair use, Physiotherapy involvement.
4. **Falls Risk:** History, Risk factors, Prevention measures, Monitoring.
5. **Personal Care:** Bathing/showering preferences, Oral/Skin/Hair/Nail care, Shaving preferences, Support required.
6. **Continence:** Urinary/Bowel, Pad type/size, Frequency of checks, Catheter details.
7. **Nutrition and Hydration:** Weight, MUST score, Dietary requirements, Allergies, Food preferences, Fluid intake, Assistance needed.
8. **Medication:** Level of independence, Administration requirements, Covert medication, Allergies, Side effects.
9. **Skin Integrity:** Waterlow score, Pressure ulcer risk, Skin condition, Repositioning requirements, Specialist equipment.
10. **Mental Health and Emotional Wellbeing:** Mood, Anxiety, Depression, Behavioural concerns, Triggers, Coping strategies.
11. **Dementia Care:** Diagnosis, Orientation needs, Behaviour support, Memory difficulties, Risks.
12. **Activities and Social Needs:** Hobbies, Interests, Social preferences, Community, Family contact.
13. **Sleep and Night Needs:** Bedtime routine, Night checks, Sleep patterns, Risks at night.
14. **Health Conditions:** Parkinson's, Diabetes, Stroke, Epilepsy, COPD, Heart failure, Arthritis (Impact on daily living, Symptoms, Escalation).
15. **End of Life:** Advance decisions, DNACPR, Wishes, Family involvement, Preferred place.

### Linked Risk Assessments
Falls, Mobility, Nutrition, Skin integrity, Medication, Fire evacuation (PEEP), Choking, Behaviour, Leaving the home, Manual handling.

*Note: For medication, health, MCA and DoLS, staff should be able to attach paperwork.*
