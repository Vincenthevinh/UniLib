import React from 'react';
import ScreenPlaceholder from './ScreenPlaceholder';

export default function SCR08ReturnBookPage() {
  return (
    <ScreenPlaceholder
      screenId="SCR-08"
      screenName="Circulation Desk — Return (Check-in) Screen"
      primaryActor="Librarian"
      feature="F05, F06"
      useCases="UC-08"
    />
  );
}