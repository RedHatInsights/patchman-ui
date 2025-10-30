import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

export const NavigateToSystem = () => {
  const { inventoryId } = useParams();

  return <Navigate to={`../systems/${inventoryId}`} />;
};
