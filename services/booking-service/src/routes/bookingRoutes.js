const express = require('express');
const { success, authenticate, authorize } = require('@rgh/shared');
const { db } = require('../lib/db');

const router = express.Router();

// --- Bookings ---
router.get('/bookings', authenticate, async (req, res, next) => {
  try {
    const where = req.user.role === 'admin' ? {} : { tenantId: req.user.id };
    const bookings = await db.booking.findMany({ where, orderBy: { createdAt: 'desc' } });
    return success(res, bookings);
  } catch (err) { next(err); }
});

router.post('/bookings', authenticate, authorize('tenant'), async (req, res, next) => {
  try {
    const booking = await db.booking.create({ data: { ...req.body, tenantId: req.user.id } });
    return success(res, booking, 'Booking created', 201);
  } catch (err) { next(err); }
});

router.patch('/bookings/:id/cancel', authenticate, async (req, res, next) => {
  try {
    const booking = await db.booking.update({ where: { id: req.params.id }, data: { status: 'cancelled' } });
    return success(res, booking, 'Booking cancelled');
  } catch (err) { next(err); }
});

// --- Guest Requests ---
router.get('/guests', authenticate, async (req, res, next) => {
  try {
    const where = req.user.role === 'admin' || req.user.role === 'security_guard' ? {} : { tenantId: req.user.id };
    const guests = await db.guestRequest.findMany({ where, orderBy: { createdAt: 'desc' } });
    return success(res, guests);
  } catch (err) { next(err); }
});

router.post('/guests', authenticate, authorize('tenant'), async (req, res, next) => {
  try {
    const guest = await db.guestRequest.create({ data: { ...req.body, tenantId: req.user.id } });
    return success(res, guest, 'Guest request created', 201);
  } catch (err) { next(err); }
});

router.patch('/guests/:id/approve', authenticate, authorize('security_guard'), async (req, res, next) => {
  try {
    const guest = await db.guestRequest.update({
      where: { id: req.params.id },
      data: { status: 'approved', approvedBy: req.user.id },
    });
    return success(res, guest, 'Guest approved');
  } catch (err) { next(err); }
});

router.patch('/guests/:id/reject', authenticate, authorize('security_guard'), async (req, res, next) => {
  try {
    const guest = await db.guestRequest.update({ where: { id: req.params.id }, data: { status: 'rejected' } });
    return success(res, guest, 'Guest rejected');
  } catch (err) { next(err); }
});

// --- Wallet ---
router.get('/wallet', authenticate, authorize('tenant'), async (req, res, next) => {
  try {
    let wallet = await db.wallet.findUnique({
      where: { tenantId: req.user.id },
      include: { transactions: { orderBy: { createdAt: 'desc' }, take: 20 } },
    });
    if (!wallet) {
      wallet = await db.wallet.create({ data: { tenantId: req.user.id } });
    }
    return success(res, wallet);
  } catch (err) { next(err); }
});

router.post('/wallet/recharge', authenticate, authorize('tenant'), async (req, res, next) => {
  try {
    const { amount } = req.body;
    let wallet = await db.wallet.findUnique({ where: { tenantId: req.user.id } });
    if (!wallet) {
      wallet = await db.wallet.create({ data: { tenantId: req.user.id } });
    }
    const updated = await db.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: amount } },
    });
    await db.walletTransaction.create({
      data: { walletId: wallet.id, amount, type: 'credit', description: 'Wallet recharge' },
    });
    return success(res, updated, 'Wallet recharged');
  } catch (err) { next(err); }
});

router.get('/wallet/transactions', authenticate, authorize('tenant', 'admin'), async (req, res, next) => {
  try {
    const wallet = await db.wallet.findUnique({ where: { tenantId: req.user.id } });
    if (!wallet) return success(res, []);
    const transactions = await db.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
    });
    return success(res, transactions);
  } catch (err) { next(err); }
});

// --- Payments ---
router.get('/payments', authenticate, async (req, res, next) => {
  try {
    const where = req.user.role === 'admin' ? {} : { tenantId: req.user.id };
    const payments = await db.payment.findMany({ where, orderBy: { createdAt: 'desc' } });
    return success(res, payments);
  } catch (err) { next(err); }
});

router.post('/payments', authenticate, authorize('tenant'), async (req, res, next) => {
  try {
    const payment = await db.payment.create({ data: { ...req.body, tenantId: req.user.id } });
    return success(res, payment, 'Payment initiated', 201);
  } catch (err) { next(err); }
});

// --- Promo Codes ---
router.post('/promo/apply', authenticate, async (req, res, next) => {
  try {
    const { code } = req.body;
    const promo = await db.promoCode.findUnique({ where: { code } });
    if (!promo || promo.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Invalid promo code' });
    }
    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'Promo code expired' });
    }
    return success(res, promo, 'Promo code applied');
  } catch (err) { next(err); }
});

module.exports = router;
