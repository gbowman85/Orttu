'use client';

import ConnectionsList from "@/components/dashboard/ConnectionsList";
import ConnectionsToolbar from "@/components/dashboard/ConnectionsToolbar";
import { ConnectionsProvider } from '@/contexts/ConnectionsContext';

export default function ConnectionsPage() {
  return (
    <ConnectionsProvider>
      <ConnectionsToolbar />
      <ConnectionsList />
    </ConnectionsProvider>
  );
} 