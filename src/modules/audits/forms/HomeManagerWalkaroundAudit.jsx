import React from 'react';
import BaseAuditForm from '../core/BaseAuditForm';
import { homeManagerWalkaroundConfig } from '../configs/homeManagerWalkaround.config';

const HomeManagerWalkaroundAudit = (props) => {
  return (
    <BaseAuditForm 
      config={homeManagerWalkaroundConfig}
      {...props}
    />
  );
};

export default HomeManagerWalkaroundAudit;
