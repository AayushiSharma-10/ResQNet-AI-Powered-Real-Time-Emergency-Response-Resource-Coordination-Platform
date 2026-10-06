import { describe, expect, it } from 'vitest';
import { buildAIAssessment, classifyIncident } from '../src/services/ai.js';

describe('AI incident triage', () => {
  it('classifies a fire emergency accurately', () => {
    const result = classifyIncident('Warehouse fire with heavy smoke and multiple staff trapped inside');
    expect(result.type).toBe('FIRE');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('returns a structured assessment with clear severity and resource recommendations', () => {
    const result = buildAIAssessment({
      type: 'MEDICAL',
      description: 'Patient has chest pain and shortness of breath after severe dizziness.',
      locationName: 'North District Clinic',
      peopleAffected: 1,
      injuries: 1,
      hazards: 'cardiac emergency',
    });

    expect(result.severity.severity).toBe('HIGH');
    expect(result.resources.resources.length).toBeGreaterThan(0);
    expect(result.summary.summary).toContain('North District Clinic');
  });
});
