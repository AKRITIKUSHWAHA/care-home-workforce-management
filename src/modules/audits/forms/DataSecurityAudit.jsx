import React from 'react';
import BaseAuditForm from '../core/BaseAuditForm';
import { dataSecurityConfig } from '../configs/dataSecurity.config';

const DataSecurityAudit = (props) => {
  return (
    <BaseAuditForm 
      config={dataSecurityConfig}
      {...props}
    />
  );
};

export default DataSecurityAudit;
