'use client';

import ReusableDataTable from "@/components/dashboard/ReusableDataTable";
import ReusableDataToolbar from "@/components/dashboard/ReusableDataToolbar";
import { ReusableDataProvider } from '@/contexts/ReusableDataContext';

export default function ReusableDataPage() {
  return (
    <ReusableDataProvider>
        <ReusableDataToolbar />
        <ReusableDataTable />
    </ReusableDataProvider>
  );
} 