const express = require('express');
const { success, authenticate, authorize } = require('@rgh/shared');
const { db } = require('../lib/db');

const router = express.Router();

// --- Guards ---
router.get('/guards', authenticate, authorize('admin'), async (_req, res, next) => {
  try {
    const guards = await db.guard.findMany();
    return success(res, guards);
  } catch (err) { next(err); }
});

router.post('/guards', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const guard = await db.guard.create({ data: req.body });
    return success(res, guard, 'Guard created', 201);
  } catch (err) { next(err); }
});

router.put('/guards/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const guard = await db.guard.update({ where: { id: req.params.id }, data: req.body });
    return success(res, guard, 'Guard updated');
  } catch (err) { next(err); }
});

router.delete('/guards/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    await db.guard.delete({ where: { id: req.params.id } });
    return success(res, null, 'Guard deleted');
  } catch (err) { next(err); }
});

router.patch('/guards/:id/assign-property', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const guard = await db.guard.update({ where: { id: req.params.id }, data: { propertyId: req.body.propertyId } });
    return success(res, guard, 'Property assigned');
  } catch (err) { next(err); }
});

// --- Incidents ---
router.get('/incidents', authenticate, authorize('admin', 'security_guard'), async (_req, res, next) => {
  try {
    const incidents = await db.incident.findMany({ include: { guard: true }, orderBy: { createdAt: 'desc' } });
    return success(res, incidents);
  } catch (err) { next(err); }
});

router.post('/incidents', authenticate, authorize('security_guard'), async (req, res, next) => {
  try {
    const incident = await db.incident.create({ data: { ...req.body, guardId: req.user.id } });
    return success(res, incident, 'Incident reported', 201);
  } catch (err) { next(err); }
});

// --- Providers ---
router.get('/providers', authenticate, authorize('admin'), async (_req, res, next) => {
  try {
    const providers = await db.provider.findMany({ include: { slots: true } });
    return success(res, providers);
  } catch (err) { next(err); }
});

router.post('/providers', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const provider = await db.provider.create({ data: req.body });
    return success(res, provider, 'Provider created', 201);
  } catch (err) { next(err); }
});

router.put('/providers/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const provider = await db.provider.update({ where: { id: req.params.id }, data: req.body });
    return success(res, provider, 'Provider updated');
  } catch (err) { next(err); }
});

router.delete('/providers/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    await db.provider.delete({ where: { id: req.params.id } });
    return success(res, null, 'Provider deleted');
  } catch (err) { next(err); }
});

router.patch('/providers/:id/status', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const provider = await db.provider.update({ where: { id: req.params.id }, data: { status: req.body.status } });
    return success(res, provider, 'Provider status updated');
  } catch (err) { next(err); }
});

// --- Third Parties ---
router.get('/third-parties', authenticate, authorize('admin'), async (_req, res, next) => {
  try {
    const parties = await db.thirdParty.findMany();
    return success(res, parties);
  } catch (err) { next(err); }
});

router.post('/third-parties', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const party = await db.thirdParty.create({ data: req.body });
    return success(res, party, 'Third party created', 201);
  } catch (err) { next(err); }
});

router.put('/third-parties/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const party = await db.thirdParty.update({ where: { id: req.params.id }, data: req.body });
    return success(res, party, 'Third party updated');
  } catch (err) { next(err); }
});

router.delete('/third-parties/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    await db.thirdParty.delete({ where: { id: req.params.id } });
    return success(res, null, 'Third party deleted');
  } catch (err) { next(err); }
});

// --- Service Requests ---
router.get('/requests', authenticate, async (_req, res, next) => {
  try {
    const requests = await db.serviceRequest.findMany({ orderBy: { createdAt: 'desc' } });
    return success(res, requests);
  } catch (err) { next(err); }
});

router.post('/requests', authenticate, async (req, res, next) => {
  try {
    const request = await db.serviceRequest.create({ data: req.body });
    return success(res, request, 'Service request created', 201);
  } catch (err) { next(err); }
});

router.patch('/requests/:id/assign', authenticate, authorize('service_team', 'admin'), async (req, res, next) => {
  try {
    const request = await db.serviceRequest.update({
      where: { id: req.params.id },
      data: { assignedTo: req.body.assignedTo, status: 'assigned' },
    });
    return success(res, request, 'Request assigned');
  } catch (err) { next(err); }
});

router.patch('/requests/:id/complete', authenticate, authorize('service_team', 'service_provider'), async (req, res, next) => {
  try {
    const request = await db.serviceRequest.update({
      where: { id: req.params.id },
      data: { status: 'completed' },
    });
    return success(res, request, 'Request completed');
  } catch (err) { next(err); }
});

// --- Provider Slots ---
router.get('/providers/:providerId/slots', authenticate, async (req, res, next) => {
  try {
    const slots = await db.providerSlot.findMany({ where: { providerId: req.params.providerId } });
    return success(res, slots);
  } catch (err) { next(err); }
});

router.post('/providers/:providerId/slots', authenticate, authorize('service_provider', 'admin'), async (req, res, next) => {
  try {
    const slot = await db.providerSlot.create({ data: { ...req.body, providerId: req.params.providerId } });
    return success(res, slot, 'Slot created', 201);
  } catch (err) { next(err); }
});

// --- Jobs ---
router.get('/jobs', authenticate, async (_req, res, next) => {
  try {
    const jobs = await db.job.findMany({ include: { provider: true } });
    return success(res, jobs);
  } catch (err) { next(err); }
});

router.patch('/jobs/:id/accept', authenticate, authorize('service_provider'), async (req, res, next) => {
  try {
    const job = await db.job.update({ where: { id: req.params.id }, data: { status: 'accepted' } });
    return success(res, job, 'Job accepted');
  } catch (err) { next(err); }
});

router.patch('/jobs/:id/reject', authenticate, authorize('service_provider'), async (req, res, next) => {
  try {
    const job = await db.job.update({ where: { id: req.params.id }, data: { status: 'rejected' } });
    return success(res, job, 'Job rejected');
  } catch (err) { next(err); }
});

router.patch('/jobs/:id/complete', authenticate, authorize('service_provider'), async (req, res, next) => {
  try {
    const job = await db.job.update({ where: { id: req.params.id }, data: { status: 'completed' } });
    return success(res, job, 'Job completed');
  } catch (err) { next(err); }
});

module.exports = router;
