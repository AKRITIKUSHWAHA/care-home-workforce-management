import React from 'react';
import BaseAuditForm from '../core/BaseAuditForm';
import { mealTimeConfig } from '../configs/mealTime.config';

const MealTimeAudit = (props) => {
  return (
    <BaseAuditForm 
      config={mealTimeConfig}
      {...props}
    />
  );
};

export default MealTimeAudit;
