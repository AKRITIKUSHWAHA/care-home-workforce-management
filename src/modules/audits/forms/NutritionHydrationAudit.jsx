import React from 'react';
import BaseAuditForm from '../core/BaseAuditForm';
import { nutritionHydrationConfig } from '../configs/nutritionHydration.config';

const NutritionHydrationAudit = (props) => {
  return (
    <BaseAuditForm 
      config={nutritionHydrationConfig}
      {...props}
    />
  );
};

export default NutritionHydrationAudit;
