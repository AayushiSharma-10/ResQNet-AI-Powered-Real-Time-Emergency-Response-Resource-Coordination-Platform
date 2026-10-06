import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  role: z.enum(['CITIZEN','RESPONDER','DISPATCHER','HOSPITAL','ADMINISTRATOR','EMERGENCY_AUTHORITY']).default('CITIZEN'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const incidentSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  type: z.enum(['MEDICAL','FIRE','ROAD_ACCIDENT','CRIME','NATURAL_DISASTER','FLOOD','EARTHQUAKE','MISSING_PERSON','INFRASTRUCTURE_FAILURE','OTHER']),
  locationName: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  numberPeopleAffected: z.number().int().min(0).optional(),
  injuries: z.number().int().min(0).optional(),
  hazards: z.string().optional(),
  reportedById: z.string().optional(),
});

export const assignmentSchema = z.object({
  incidentId: z.string(),
  resourceType: z.string(),
  resourceId: z.string().optional(),
  responderId: z.string().optional(),
});

export const alertSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  severity: z.enum(['LOW','MEDIUM','HIGH','CRITICAL']),
  area: z.string().optional(),
  targetAudience: z.string().optional(),
  startTime: z.coerce.date(),
  expiryTime: z.coerce.date().optional(),
});
