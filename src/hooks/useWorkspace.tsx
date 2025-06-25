
import React, { createContext, useContext, ReactNode } from 'react';
import { useWorkspaceCore } from './useWorkspaceCore';

type UseWorkspaceReturn = ReturnType<typeof useWorkspaceCore>;

const WorkspaceContext = createContext<UseWorkspaceReturn | null>(null);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const workspace = useWorkspaceCore();
  return (
    <WorkspaceContext.Provider value={workspace}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = (): UseWorkspaceReturn => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
