import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const hashPassword = async (password: string) => bcrypt.hash(password, 10);

async function main() {
  const users = [
    {
      email: 'admin@resqnet.local',
      phone: '+15550000001',
      password: 'Admin123!',
      firstName: 'Ava',
      lastName: 'Nguyen',
      role: 'ADMINISTRATOR' as const,
    },
    {
      email: 'dispatcher@resqnet.local',
      phone: '+15550000002',
      password: 'Dispatch123!',
      firstName: 'Milo',
      lastName: 'Patel',
      role: 'DISPATCHER' as const,
    },
    {
      email: 'responder@resqnet.local',
      phone: '+15550000003',
      password: 'Responder123!',
      firstName: 'Sara',
      lastName: 'Kim',
      role: 'RESPONDER' as const,
    },
    {
      email: 'hospital@resqnet.local',
      phone: '+15550000004',
      password: 'Hospital123!',
      firstName: 'Elena',
      lastName: 'Mora',
      role: 'HOSPITAL' as const,
    },
    {
      email: 'citizen@resqnet.local',
      phone: '+15550000005',
      password: 'Citizen123!',
      firstName: 'Jordan',
      lastName: 'Lee',
      role: 'CITIZEN' as const,
    },
  ];

  for (const user of users) {
    const passwordHash = await hashPassword(user.password);
    await prisma.user.upsert({
      where: { email: user.email },
      update: { passwordHash, phone: user.phone, firstName: user.firstName, lastName: user.lastName, role: user.role },
      create: {
        email: user.email,
        phone: user.phone,
        passwordHash,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  }

  const admin = await prisma.user.findUnique({ where: { email: 'admin@resqnet.local' } });
  const responder = await prisma.user.findUnique({ where: { email: 'responder@resqnet.local' } });
  const hospital = await prisma.user.findUnique({ where: { email: 'hospital@resqnet.local' } });
  const citizen = await prisma.user.findUnique({ where: { email: 'citizen@resqnet.local' } });

  const incidents = [
    {
      incidentNumber: 'RQ-10001',
      type: 'ROAD_ACCIDENT',
      severity: 'CRITICAL',
      status: 'DISPATCHED',
      title: 'Multi-vehicle collision near Rivergate',
      description: 'Three vehicles collided on Rivergate Expressway with entrapment and heavy smoke. Multiple injuries reported.',
      locationName: 'Rivergate Expressway',
      latitude: 40.7128,
      longitude: -74.006,
      priorityScore: 92,
      createdById: citizen?.id ?? undefined,
      reportedById: citizen?.id ?? undefined,
    },
    {
      incidentNumber: 'RQ-10002',
      type: 'MEDICAL',
      severity: 'HIGH',
      status: 'EN_ROUTE',
      title: 'Cardiac emergency',
      description: 'Senior resident reported chest pain and difficulty breathing. Ambulance en route with paramedics.',
      locationName: 'North District Clinic',
      latitude: 40.7205,
      longitude: -73.996,
      priorityScore: 82,
      createdById: citizen?.id ?? undefined,
      reportedById: citizen?.id ?? undefined,
    },
    {
      incidentNumber: 'RQ-10003',
      type: 'FIRE',
      severity: 'HIGH',
      status: 'ON_SCENE',
      title: 'Warehouse fire',
      description: 'Small commercial warehouse showing heavy smoke. Fire crews deployed to contain the blaze.',
      locationName: 'Harbor Industrial Park',
      latitude: 40.731,
      longitude: -74.01,
      priorityScore: 78,
      createdById: citizen?.id ?? undefined,
      reportedById: citizen?.id ?? undefined,
    },
  ] as const;

  for (const incident of incidents) {
    await prisma.incident.upsert({
      where: { incidentNumber: incident.incidentNumber },
      update: incident,
      create: incident,
    });
  }

  const firstIncident = await prisma.incident.findUnique({ where: { incidentNumber: 'RQ-10001' } });
  if (firstIncident) {
    await prisma.dispatch.upsert({
      where: { id: 'seed-dispatch-1' },
      update: {},
      create: {
        id: 'seed-dispatch-1',
        incidentId: firstIncident.id,
        dispatchType: 'ambulance',
        resourceType: 'ambulance',
        assignedToUserId: responder?.id,
        status: 'pending',
        etaMinutes: 6,
      },
    });
  }

  await prisma.resource.upsert({
    where: { id: 'seed-resource-1' },
    update: {},
    create: {
      id: 'seed-resource-1',
      resourceType: 'ambulance',
      name: 'Ambulance A12',
      status: 'AVAILABLE',
      capacity: 2,
      currentLoad: 1,
      locationName: 'Central District',
      latitude: 40.714,
      longitude: -73.998,
      availability: true,
    },
  });

  await prisma.resource.upsert({
    where: { id: 'seed-resource-2' },
    update: {},
    create: {
      id: 'seed-resource-2',
      resourceType: 'fire_unit',
      name: 'Fire Unit F04',
      status: 'EN_ROUTE',
      capacity: 5,
      currentLoad: 2,
      locationName: 'Harbor Industrial Park',
      latitude: 40.731,
      longitude: -74.01,
      availability: true,
    },
  });

  await prisma.hospitalProfile.upsert({
    where: { userId: hospital?.id ?? 'missing' },
    update: {},
    create: {
      userId: hospital?.id ?? 'placeholder-user',
      facilityName: 'City General Hospital',
      region: 'North District',
      emergencyBeds: 32,
      icuBeds: 12,
      totalCapacity: 280,
      latitude: 40.718,
      longitude: -73.99,
    },
  });

  await prisma.alert.upsert({
    where: { id: 'seed-alert-1' },
    update: {},
    create: {
      id: 'seed-alert-1',
      title: 'Flood Advisory',
      description: 'Riverfront and low-lying neighborhoods should prepare for possible flooding.',
      severity: 'HIGH',
      area: 'North Basin',
      targetAudience: 'all',
      startTime: new Date(),
      expiryTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
      isActive: true,
    },
  });

  await prisma.notification.upsert({
    where: { id: 'seed-notification-1' },
    update: {},
    create: {
      id: 'seed-notification-1',
      userId: admin?.id ?? null,
      title: 'Alert update',
      message: 'Critical route conditions detected in the river district.',
      channel: 'IN_APP',
      status: 'SENT',
      metadata: { severity: 'HIGH' },
    },
  });

  console.log('Seed completed.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
