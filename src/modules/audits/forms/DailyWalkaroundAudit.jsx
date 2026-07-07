import React from 'react';
import BaseAuditForm from '../core/BaseAuditForm';
import { dailyChartConfig } from '../configs/dailyChart.config';

const DailyWalkaroundAudit = (props) => {
  return (
    <BaseAuditForm 
      config={dailyChartConfig}
      {...props}
    />
  );
};

export default DailyWalkaroundAudit;
