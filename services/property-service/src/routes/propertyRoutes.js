const express = require('express');
const { success, authenticate, authorize } = require('@rgh/shared');
const { db } = require('../lib/db');

const router = express.Router();

// --- Tenants (specific routes before /:id) ---
router.get('/tenants/list', authenticate, authorize('admin'), async (_req, res, next) => {
  try {
    const tenants = await db.tenant.findMany({ include: { property: true, familyMembers: true } });
    return success(res, tenants);
  } catch (err) { next(err); }
});

router.post('/tenants', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const tenant = await db.tenant.create({ data: req.body });
    return success(res, tenant, 'Tenant created', 201);
  } catch (err) { next(err); }
});

router.put('/tenants/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const tenant = await db.tenant.update({ where: { id: req.params.id }, data: req.body });
    return success(res, tenant, 'Tenant updated');
  } catch (err) { next(err); }
});

router.delete('/tenants/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    await db.tenant.delete({ where: { id: req.params.id } });
    return success(res, null, 'Tenant deleted');
  } catch (err) { next(err); }
});

router.patch('/tenants/:id/status', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const tenant = await db.tenant.update({ where: { id: req.params.id }, data: { status: req.body.status } });
    return success(res, tenant, 'Tenant status updated');
  } catch (err) { next(err); }
});

// --- Family Members ---
router.get('/tenants/:tenantId/family', authenticate, async (req, res, next) => {
  try {
    const members = await db.familyMember.findMany({ where: { tenantId: req.params.tenantId } });
    return success(res, members);
  } catch (err) { next(err); }
});

router.post('/tenants/:tenantId/family', authenticate, authorize('tenant', 'admin'), async (req, res, next) => {
  try {
    const member = await db.familyMember.create({ data: { ...req.body, tenantId: req.params.tenantId } });
    return success(res, member, 'Family member added', 201);
  } catch (err) { next(err); }
});

// --- Categories ---
router.get('/categories/list', authenticate, async (_req, res, next) => {
  try {
    const categories = await db.category.findMany({ include: { amenities: true } });
    return success(res, categories);
  } catch (err) { next(err); }
});

router.post('/categories', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const category = await db.category.create({ data: req.body });
    return success(res, category, 'Category created', 201);
  } catch (err) { next(err); }
});

router.put('/categories/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const category = await db.category.update({ where: { id: req.params.id }, data: req.body });
    return success(res, category, 'Category updated');
  } catch (err) { next(err); }
});

router.delete('/categories/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    await db.category.delete({ where: { id: req.params.id } });
    return success(res, null, 'Category deleted');
  } catch (err) { next(err); }
});

// --- Amenities ---
router.get('/amenities/list', authenticate, async (_req, res, next) => {
  try {
    const amenities = await db.amenity.findMany({ include: { category: true } });
    return success(res, amenities);
  } catch (err) { next(err); }
});

router.post('/amenities', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const amenity = await db.amenity.create({ data: req.body });
    return success(res, amenity, 'Amenity created', 201);
  } catch (err) { next(err); }
});

router.put('/amenities/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const amenity = await db.amenity.update({ where: { id: req.params.id }, data: req.body });
    return success(res, amenity, 'Amenity updated');
  } catch (err) { next(err); }
});

router.delete('/amenities/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    await db.amenity.delete({ where: { id: req.params.id } });
    return success(res, null, 'Amenity deleted');
  } catch (err) { next(err); }
});

// --- Properties (parameterized routes last) ---
router.get('/', authenticate, async (_req, res, next) => {
  try {
    const properties = await db.property.findMany({ include: { propertyAmenities: { include: { amenity: true } } } });
    return success(res, properties);
  } catch (err) { next(err); }
});

router.post('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const property = await db.property.create({ data: req.body });
    return success(res, property, 'Property created', 201);
  } catch (err) { next(err); }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const property = await db.property.findUnique({
      where: { id: req.params.id },
      include: { tenants: true, propertyAmenities: { include: { amenity: true } } },
    });
    return success(res, property);
  } catch (err) { next(err); }
});

router.put('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const property = await db.property.update({ where: { id: req.params.id }, data: req.body });
    return success(res, property, 'Property updated');
  } catch (err) { next(err); }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    await db.property.delete({ where: { id: req.params.id } });
    return success(res, null, 'Property deleted');
  } catch (err) { next(err); }
});

module.exports = router;
