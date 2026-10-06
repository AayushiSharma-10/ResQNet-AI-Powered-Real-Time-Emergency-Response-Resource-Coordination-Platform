import { Router } from 'express';
import { z } from 'zod';
import { buildAIAssessment } from '../services/ai.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const aiRequestSchema = z.object({
  description: z.string().min(5),
  type: z.enum(['MEDICAL','FIRE','ROAD_ACCIDENT','CRIME','NATURAL_DISASTER','FLOOD','EARTHQUAKE','MISSING_PERSON','INFRASTRUCTURE_FAILURE','OTHER']).optional(),
  locationName: z.string().optional(),
  peopleAffected: z.number().int().min(0).optional(),
  injuries: z.number().int().min(0).optional(),
  hazards: z.string().optional(),
});

router.post('/triage', requireAuth, async (req, res) => {
  const parsed = aiRequestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid AI triage input.', issues: parsed.error.flatten() });

  const result = buildAIAssessment({
    type: parsed.data.type ?? 'OTHER',
    description: parsed.data.description,
    locationName: parsed.data.locationName,
    peopleAffected: parsed.data.peopleAffected,
    injuries: parsed.data.injuries,
    hazards: parsed.data.hazards,
  });

  res.json({ result });
});

export default router;
