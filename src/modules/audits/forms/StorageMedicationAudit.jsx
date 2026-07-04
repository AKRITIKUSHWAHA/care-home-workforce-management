import React from 'react';
import BaseAuditForm from '../core/BaseAuditForm';
import { storageMedicationConfig } from '../configs/storageMedication.config';

const StorageMedicationAudit = (props) => {
  return (
    <BaseAuditForm 
      config={storageMedicationConfig}
      {...props}
    />
  );
};

export default StorageMedicationAudit;
