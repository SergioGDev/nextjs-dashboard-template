'use client';

import { useQuery } from '@tanstack/react-query';
import { reportsHandler } from './reports.handler';
import { reportsKeys } from './reports.keys';

export function useReports() {
  return useQuery({
    queryKey: reportsKeys.lists(),
    queryFn: ({ signal }) => reportsHandler.getAll({ signal }),
  });
}
