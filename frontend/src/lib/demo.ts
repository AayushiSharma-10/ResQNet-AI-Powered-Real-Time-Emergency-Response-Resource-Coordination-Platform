export type IncidentStatus = 'RECEIVED' | 'TRIAGE_COMPLETE' | 'DISPATCHED' | 'EN_ROUTE' | 'ON_SCENE' | 'RESOLVING' | 'RESOLVED' | 'CLOSED';

export type DemoIncident = {
  id: string;
  incidentNumber: string;
  title: string;
  description: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: IncidentStatus;
  locationName: string;
  priorityScore: number;
  createdAt: string;
};

export const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export const demoIncidents: DemoIncident[] = [
  { id: 'inc-101', incidentNumber: 'RQ-10001', title: 'Multi-vehicle collision', description: 'Three vehicles collided near the Rivergate interchange. Multiple injuries reported.', type: 'ROAD_ACCIDENT', severity: 'CRITICAL', status: 'DISPATCHED', locationName: 'Rivergate Expressway', priorityScore: 92, createdAt: '2026-10-06T00:10:00.000Z' },
  { id: 'inc-102', incidentNumber: 'RQ-10002', title: 'Cardiac emergency', description: 'Patient with chest pain and shortness of breath is awaiting ambulance support.', type: 'MEDICAL', severity: 'HIGH', status: 'EN_ROUTE', locationName: 'North District Clinic', priorityScore: 82, createdAt: '2026-10-06T00:18:00.000Z' },
  { id: 'inc-103', incidentNumber: 'RQ-10003', title: 'Warehouse fire', description: 'Fire reported in a storage warehouse with heavy smoke and limited access.', type: 'FIRE', severity: 'HIGH', status: 'ON_SCENE', locationName: 'Harbor Industrial Park', priorityScore: 78, createdAt: '2026-10-06T00:22:00.000Z' },
];

export const demoResources = [
  { id: 'res-1', resourceType: 'ambulance', name: 'Ambulance A12', status: 'AVAILABLE', capacity: 2, locationName: 'Central District' },
  { id: 'res-2', resourceType: 'fire_unit', name: 'Fire Unit F04', status: 'EN_ROUTE', capacity: 5, locationName: 'Harbor Industrial Park' },
  { id: 'res-3', resourceType: 'police_unit', name: 'Police Unit P21', status: 'AVAILABLE', capacity: 4, locationName: 'North Sector' },
];

export const demoAlerts = [
  { id: 'alert-1', title: 'Flood advisory', severity: 'HIGH', area: 'North Basin', message: 'Heavy runoff is expected to affect low-lying neighborhoods.' },
  { id: 'alert-2', title: 'Hospital capacity update', severity: 'MEDIUM', area: 'Central District', message: 'City General reports 16 emergency beds available.' },
];

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window === 'undefined'
    ? null
    : window.localStorage.getItem('resqnet-token');
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
