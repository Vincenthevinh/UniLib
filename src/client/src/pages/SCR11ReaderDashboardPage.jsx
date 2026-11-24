import React from 'react';
import ScreenPlaceholder from './ScreenPlaceholder';

export default function SCR11ReaderDashboardPage() {
  return (
    <ScreenPlaceholder
      screenId="SCR-11"
      screenName="Reader Personal Dashboard Screen"
      primaryActor="Reader"
      feature="F05, F06, F07"
      useCases="UC-09, UC-11, UC-12"
    />
  );
}