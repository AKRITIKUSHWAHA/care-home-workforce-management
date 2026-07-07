import React from 'react';
import BaseAuditForm from '../core/BaseAuditForm';
import { houseKeepingConfig } from '../configs/houseKeeping.config';

const HouseKeepingAudit = (props) => {
  return (
    <BaseAuditForm 
      config={houseKeepingConfig}
      {...props}
    />
  );
};

export default HouseKeepingAudit;
