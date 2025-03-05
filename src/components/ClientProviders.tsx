'use client';

import React, { ReactNode } from 'react';

interface ClientProvidersProps {
  children: ReactNode;
}

// This component ensures that client-side code is executed properly
// and helps prevent hydration errors
const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => {
  return <>{children}</>;
};

export default ClientProviders;