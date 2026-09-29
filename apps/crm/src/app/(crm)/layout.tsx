import { ReactNode } from 'react';
import { CrmLayout } from '@/components/layout/CrmLayout';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <CrmLayout>{children}</CrmLayout>;
}
