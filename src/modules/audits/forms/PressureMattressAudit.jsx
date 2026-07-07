import React from 'react';
import BaseAuditForm from '../core/BaseAuditForm';
import { mattressConfig } from '../configs/mattress.config';

const PressureMattressAudit = (props) => {
  return (
    <BaseAuditForm 
      config={mattressConfig}
      {...props}
    />
  );
};

export default PressureMattressAudit;
