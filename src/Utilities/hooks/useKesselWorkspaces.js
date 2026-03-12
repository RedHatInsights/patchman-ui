import { useState, useEffect } from 'react';
import { fetchDefaultWorkspace } from '@project-kessel/react-kessel-access-check';

let defaultWorkspacePromise = null;

export const useFetchDefaultWorkspaceId = (enabled = true) => {
  const [defaultWorkspace, setDefaultWorkspace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = window.location.origin;

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    if (!defaultWorkspacePromise) {
      defaultWorkspacePromise = fetchDefaultWorkspace(baseUrl);
    }

    defaultWorkspacePromise
      .then(setDefaultWorkspace)
      .catch((err) => {
        defaultWorkspacePromise = null;
        setError(err);
      })
      .finally(() => setIsLoading(false));
  }, [baseUrl, enabled]);

  return {
    workspaceId: defaultWorkspace?.id,
    isLoading,
    error,
  };
};
