import React from 'react';
import BaseAuditForm from '../core/BaseAuditForm';
import { covertMedicationConfig } from '../configs/covertMedication.config';

const CovertMedicationAudit = (props) => {
  return (
    <BaseAuditForm 
      config={covertMedicationConfig}
      {...props}
    />
  );
};

export default CovertMedicationAudit;
