import React from 'react';
import BaseAuditForm from './BaseAuditForm';
import { useApp } from '../../../context/AppContext';

// Import All 15 CQC Spreadsheet configurations
import { dailyWalkroundConfig } from '../configs/dailyWalkround.config';
import { dailyChartConfig } from '../configs/dailyChart.config';
import { weeklyMedicationConfig } from '../configs/weeklyMedication.config';
import { monthlyMedicationConfig } from '../configs/monthlyMedication.config';
import { carePlanConfig } from '../configs/carePlan.config';
import { mealTimeConfig } from '../configs/mealTime.config';
import { diningExperienceConfig } from '../configs/diningExperience.config';
import { fireConfig } from '../configs/fire.config';
import { healthSafetyConfig } from '../configs/healthSafety.config';
import { infectionControlConfig } from '../configs/infectionControl.config';
import { kitchenConfig } from '../configs/kitchen.config';
import { callBellConfig } from '../configs/callBell.config';
import { dataSecurityConfig } from '../configs/dataSecurity.config';
import { firstAidConfig } from '../configs/firstAid.config';
import { mattressConfig } from '../configs/mattress.config';

const CONFIG_MAP = {
  "Daily Walkround 2026": dailyWalkroundConfig,
  "Daily Chart Audit": dailyChartConfig,
  "Weekly Medication Audit": weeklyMedicationConfig,
  "Monthly Medication Audit": monthlyMedicationConfig,
  "Care Plan Audit": carePlanConfig,
  "Mealtime Audit": mealTimeConfig,
  "Dining Experience Audit": diningExperienceConfig,
  "Fire Audit": fireConfig,
  "Health & Safety Audit": healthSafetyConfig,
  "IPC Environment Audit": infectionControlConfig,
  "Kitchen Audit": kitchenConfig,
  "Call Bell Audit": callBellConfig,
  "Data Security Audit": dataSecurityConfig,
  "First Aid Audit": firstAidConfig,
  "Mattress Audit": mattressConfig
};

export const AuditRenderer = ({ selectedAudit, submitAuditResult, setSelectedAudit, isEditMode }) => {
  if (!selectedAudit) return null;

  const { customAuditCategories } = useApp();
  const config = CONFIG_MAP[selectedAudit.type];

  if (config) {
    return (
      <BaseAuditForm 
        config={config}
        selectedAudit={selectedAudit} 
        submitAuditResult={submitAuditResult} 
        setSelectedAudit={setSelectedAudit} 
        isEditMode={isEditMode}
      />
    );
  }

  // Fallback for custom audits
  const customCat = customAuditCategories?.find(c => c.name === selectedAudit.type);
  const customConfig = {
    title: selectedAudit.type,
    targetScore: 90,
    questions: customCat?.questions || [
      { id: 'g1', section: 'General Compliance', question: 'Are operations and activities in this department compliant with safety standards?' },
      { id: 'g2', section: 'Staff Competency', question: 'Are staff members on duty trained and following correct protocol?' },
      { id: 'g3', section: 'Documentation integrity', question: 'Are logs, records, and files properly updated, legible, and stored?' }
    ]
  };

  return (
    <BaseAuditForm
      config={customConfig}
      selectedAudit={selectedAudit}
      submitAuditResult={submitAuditResult}
      setSelectedAudit={setSelectedAudit}
      isEditMode={isEditMode}
    />
  );
};

export default AuditRenderer;
