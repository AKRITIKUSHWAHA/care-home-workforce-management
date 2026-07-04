import React from 'react';
import BaseAuditForm from './BaseAuditForm';
import { useApp } from '../../../context/AppContext';

// Import All Audit Forms for Dashboard
import DailyWalkaroundAudit from '../forms/DailyWalkaroundAudit'; // Daily Chart Audit
import MonthlyMedicationAudit from '../forms/MonthlyMedicationAudit';
import WeeklyMedicationAudit from '../forms/WeeklyMedicationAudit';
import MealTimeAudit from '../forms/MealTimeAudit';
import InfectionControlAudit from '../forms/InfectionControlAudit';
import CarePlanAudit from '../forms/CarePlanAudit';
import DignityAudit from '../forms/DignityAudit';
import FireAudit from '../forms/FireAudit';
import HealthSafetyAudit from '../forms/HealthSafetyAudit';
import PressureMattressAudit from '../forms/PressureMattressAudit'; // Mattress Audit
import NutritionHydrationAudit from '../forms/NutritionHydrationAudit'; // Meal Nutrition Audit
import CallBellAudit from '../forms/CallBellAudit';
import HouseKeepingAudit from '../forms/HouseKeepingAudit';
import KitchenAudit from '../forms/KitchenAudit';
import OrderingMedicationAudit from '../forms/OrderingMedicationAudit';
import StorageMedicationAudit from '../forms/StorageMedicationAudit';
import CovertMedicationAudit from '../forms/CovertMedicationAudit';
import DataSecurityAudit from '../forms/DataSecurityAudit';
import DailyWalkround7Audit from '../forms/DailyWalkround7Audit';
import HomeManagerWalkaroundAudit from '../forms/HomeManagerWalkaroundAudit';

// Note: The keys here MUST exactly match the strings in DEFAULT_AUDIT_CATEGORIES in AuditDashboard.jsx
const FORM_MAP = {
  "Daily Chart Audit": DailyWalkaroundAudit,
  "Monthly Medication Audit": MonthlyMedicationAudit,
  "Weekly Medication Audit": WeeklyMedicationAudit,
  "Meal Time Audit": MealTimeAudit,
  "Infection Control Audit": InfectionControlAudit,
  "Care Plan Audit": CarePlanAudit,
  "Dignity Audit": DignityAudit,
  "Fire Audit": FireAudit,
  "Health & Safety Audit": HealthSafetyAudit,
  "House Keeping Cleaning Standards": HouseKeepingAudit,
  "Kitchen Audit": KitchenAudit,
  "Mattress Audit": PressureMattressAudit,
  "Meal Nutrition Audit": NutritionHydrationAudit,
  "Ordering and Receipt of Medication Audit": OrderingMedicationAudit,
  "Call Bell Audit": CallBellAudit,
  "Storage of Medication Audit": StorageMedicationAudit,
  "Covert Medication Audit": CovertMedicationAudit,
  "Data Security Audit": DataSecurityAudit,
  "Daily Walkround 1.0 Audit": DailyWalkround7Audit,
  "Home manager daily walkaround audit": HomeManagerWalkaroundAudit
};

export const AuditRenderer = ({ selectedAudit, submitAuditResult, setSelectedAudit, isEditMode }) => {
  if (!selectedAudit) return null;

  const { customAuditCategories } = useApp();
  const FormComponent = FORM_MAP[selectedAudit.type];

  if (FormComponent) {
    return (
      <FormComponent 
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
