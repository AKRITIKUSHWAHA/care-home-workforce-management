import React from 'react';
import BaseAuditForm from '../core/BaseAuditForm';
import { dailyWalkroundConfig } from '../configs/dailyWalkround.config';

const DailyWalkround7Audit = (props) => {
  return (
    <BaseAuditForm 
      config={dailyWalkroundConfig}
      {...props}
    />
  );
};

export default DailyWalkround7Audit;
