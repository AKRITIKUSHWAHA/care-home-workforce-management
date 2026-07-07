import React from 'react';
import BaseAuditForm from '../core/BaseAuditForm';
import { kitchenConfig } from '../configs/kitchen.config';

const KitchenAudit = (props) => {
  return (
    <BaseAuditForm 
      config={kitchenConfig}
      {...props}
    />
  );
};

export default KitchenAudit;
