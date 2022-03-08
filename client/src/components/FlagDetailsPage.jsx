import React from 'react';
import { useParams } from 'react-router-dom';

const FlagDetailsPage = () => {
  const { flagId } = useParams();
  return (
    <div>Flag details for flag: {flagId}</div>
  );
};

export default FlagDetailsPage;