const express = require('express');
const { success, authenticate, authorize } = require('@rgh/shared');
const { db } = require('../lib/db');

const router = express.Router();

router.get('/', authenticate, authorize('admin'), async (_req, res, next) => {
  try {
    const notifications = await db.notification.findMany({
      include: { logs: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return success(res, notifications);
  } catch (err) { next(err); }
});

router.post('/send', authenticate, async (req, res, next) => {
  try {
    const { userId, type, channel, title, body, source } = req.body;

    const notification = await db.notification.create({
      data: { userId, type, channel, title, body, source, status: 'sent' },
    });

    await db.notificationLog.create({
      data: { notificationId: notification.id, status: 'sent', response: 'Delivered' },
    });

    if (channel === 'email') {
      await db.emailLog.create({ data: { to: userId, subject: title, body, status: 'sent' } });
    } else if (channel === 'sms') {
      await db.smsLog.create({ data: { to: userId, message: body, status: 'sent' } });
    }

    return success(res, notification, 'Notification sent', 201);
  } catch (err) { next(err); }
});

router.post('/otp', async (req, res, next) => {
  try {
    const { identifier, otpCode } = req.body;

    const notification = await db.notification.create({
      data: {
        userId: identifier,
        type: 'otp',
        channel: 'sms',
        title: 'OTP Verification',
        body: `Your OTP is: ${otpCode}`,
        source: 'auth-service',
        status: 'sent',
      },
    });

    await db.smsLog.create({
      data: { to: identifier, message: `Your OTP is: ${otpCode}`, status: 'sent' },
    });

    return success(res, { notificationId: notification.id }, 'OTP sent', 201);
  } catch (err) { next(err); }
});

router.get('/email-logs', authenticate, authorize('admin'), async (_req, res, next) => {
  try {
    const logs = await db.emailLog.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
    return success(res, logs);
  } catch (err) { next(err); }
});

router.get('/sms-logs', authenticate, authorize('admin'), async (_req, res, next) => {
  try {
    const logs = await db.smsLog.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
    return success(res, logs);
  } catch (err) { next(err); }
});

module.exports = router;
