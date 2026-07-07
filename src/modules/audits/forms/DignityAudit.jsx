import React from 'react';
import BaseAuditForm from '../core/BaseAuditForm';
import { dignityConfig } from '../configs/dignity.config';

const DignityAudit = (props) => {
  return (
    <BaseAuditForm 
      config={dignityConfig}
      {...props}
    />
  );
};

export default DignityAudit;
