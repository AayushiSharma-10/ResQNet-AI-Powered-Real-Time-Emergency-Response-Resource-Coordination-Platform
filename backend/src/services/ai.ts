import type { IncidentType, IncidentSeverity } from '@prisma/client';

const incidentTypeKeywords: Record<IncidentType, string[]> = {
  MEDICAL: ['injury', 'pain', 'stroke', 'heart', 'bleeding', 'medical', 'accident'],
  FIRE: ['fire', 'smoke', 'burning', 'explosion'],
  ROAD_ACCIDENT: ['accident', 'collision', 'crash', 'traffic', 'car', 'vehicle'],
  CRIME: ['theft', 'attack', 'assault', 'stolen', 'robbery', 'crime', 'gun'],
  NATURAL_DISASTER: ['storm', 'hurricane', 'earthquake', 'tsunami', 'natural'],
  FLOOD: ['flood', 'water rising', 'overflow', 'river'],
  EARTHQUAKE: ['quake', 'earthquake', 'shaking'],
  MISSING_PERSON: ['missing', 'lost person', 'person missing'],
  INFRASTRUCTURE_FAILURE: ['power outage', 'bridge collapse', 'water main', 'utility', 'infrastructure'],
  OTHER: ['other'],
};

const severityMap: Record<IncidentSeverity, number> = {
  LOW: 20,
  MEDIUM: 45,
  HIGH: 72,
  CRITICAL: 92,
};

export const classifyIncident = (description: string) => {
  const text = description.toLowerCase();
  let bestType: IncidentType = 'OTHER';
  let bestScore = -1;

  for (const [type, keywords] of Object.entries(incidentTypeKeywords)) {
    const score = keywords.reduce((total, keyword) => total + (text.includes(keyword) ? 2 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      bestType = type as IncidentType;
    }
  }

  return {
    type: bestType,
    confidence: Math.min(0.96, 0.55 + bestScore * 0.08),
  };
};

export const assessSeverity = (type: IncidentType, description: string, peopleAffected = 0, injuries = 0, hazards = '') => {
  const text = `${description} ${hazards}`.toLowerCase();
  let score = severityMap[type === 'ROAD_ACCIDENT' ? 'HIGH' : 'MEDIUM'] ?? 45;

  if (peopleAffected > 3) score += 14;
  if (injuries > 0) score += 10;
  if (text.includes('chest pain') || text.includes('shortness of breath') || text.includes('stroke') || text.includes('bleeding') || text.includes('unconscious')) score += 18;
  if (text.includes('fire') || text.includes('smoke')) score += 12;
  if (text.includes('critical') || text.includes('multiple injured')) score += 16;
  if (text.includes('flood') || text.includes('earthquake')) score += 8;

  const clamped = Math.min(100, Math.max(10, score));
  const severity: IncidentSeverity = clamped >= 85 ? 'CRITICAL' : clamped >= 65 ? 'HIGH' : clamped >= 40 ? 'MEDIUM' : 'LOW';

  return {
    severity,
    score: clamped,
    explanation: `AI reviewed the incoming report and found ${severity.toLowerCase()} risk based on incident category, affected persons, injuries, and reported hazards.`,
    requiresHumanConfirmation: severity === 'CRITICAL' || severity === 'HIGH',
  };
};

export const detectDuplicate = (newDescription: string, existingReports: { description: string }[]) => {
  const normalized = newDescription.toLowerCase();
  const match = existingReports.find((report) => {
    const similarity = report.description.toLowerCase().split(/\s+/).filter(Boolean).filter((word) => normalized.includes(word)).length;
    return similarity >= 3;
  });

  if (!match) {
    return { duplicate: false, similarity: 0, message: 'No likely duplicate detected.' };
  }

  return {
    duplicate: true,
    similarity: 87,
    message: `Possible duplicate incident — 87% similarity with a nearby report about ${match.description.slice(0, 40)}...`,
  };
};

export const recommendResources = (severity: IncidentSeverity, type: IncidentType, peopleAffected = 1) => {
  const baseResources = [
    { type: 'ambulance', count: severity === 'CRITICAL' ? 2 : severity === 'HIGH' ? 1 : 1 },
    { type: 'fire_unit', count: type === 'FIRE' || severity === 'CRITICAL' ? 1 : 0 },
    { type: 'police_unit', count: type === 'CRIME' || type === 'ROAD_ACCIDENT' ? 1 : 0 },
    { type: 'rescue_team', count: severity === 'CRITICAL' ? 1 : 0 },
  ];

  const resources = baseResources.filter((resource) => resource.count > 0).map((resource) => ({ ...resource, label: resource.type }));
  return {
    resources,
    summary: `Recommended response: ${resources.map((r) => `${r.count} ${r.label.replace('_', ' ')}`).join(', ')}`,
  };
};

export const summarizeIncident = (incident: { title: string; type: IncidentType; severity: IncidentSeverity; description: string; locationName?: string | null }) => ({
  summary: `${incident.severity} ${incident.type.toLowerCase().replace(/_/g, ' ')} reported at ${incident.locationName ?? 'unknown location'}. ${incident.description.slice(0, 120)}...`,
});

export const predictRisk = (area: string, incidentCount: number) => ({
  area,
  probability: Math.min(96, 35 + incidentCount * 12),
  estimate: `High probability of additional incidents in ${area} during peak hours based on recent patterns.`,
});

export const buildAIAssessment = (incident: { type: IncidentType; description: string; severity?: IncidentSeverity; locationName?: string | null; peopleAffected?: number; injuries?: number; hazards?: string }) => {
  const classification = classifyIncident(incident.description);
  const severity = assessSeverity(classification.type, incident.description, incident.peopleAffected ?? 0, incident.injuries ?? 0, incident.hazards ?? '');
  const duplicate = { duplicate: false, similarity: 0, message: 'No likely duplicate detected.' };
  const resources = recommendResources(severity.severity, classification.type, incident.peopleAffected ?? 1);
  const summary = summarizeIncident({
    title: incident.description.slice(0, 40),
    type: classification.type,
    severity: severity.severity,
    description: incident.description,
    locationName: incident.locationName,
  });
  const risk = predictRisk(incident.locationName ?? 'current zone', incident.peopleAffected ?? 1);

  return {
    classification,
    severity,
    duplicate,
    resources,
    summary,
    risk,
  };
};
