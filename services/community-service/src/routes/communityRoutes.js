const express = require('express');
const { success, authenticate, authorize } = require('@rgh/shared');
const { db } = require('../lib/db');

const router = express.Router();

router.get('/posts', authenticate, async (_req, res, next) => {
  try {
    const posts = await db.post.findMany({
      where: { status: 'published' },
      include: { comments: true, likes: true, _count: { select: { likes: true, comments: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return success(res, posts);
  } catch (err) { next(err); }
});

router.post('/posts', authenticate, authorize('tenant', 'admin'), async (req, res, next) => {
  try {
    const post = await db.post.create({ data: { ...req.body, authorId: req.user.id } });
    return success(res, post, 'Post created', 201);
  } catch (err) { next(err); }
});

router.put('/posts/:id', authenticate, async (req, res, next) => {
  try {
    const post = await db.post.update({ where: { id: req.params.id }, data: req.body });
    return success(res, post, 'Post updated');
  } catch (err) { next(err); }
});

router.delete('/posts/:id', authenticate, async (req, res, next) => {
  try {
    await db.post.delete({ where: { id: req.params.id } });
    return success(res, null, 'Post deleted');
  } catch (err) { next(err); }
});

router.post('/posts/:id/like', authenticate, async (req, res, next) => {
  try {
    const like = await db.like.upsert({
      where: { postId_userId: { postId: req.params.id, userId: req.user.id } },
      update: {},
      create: { postId: req.params.id, userId: req.user.id },
    });
    return success(res, like, 'Post liked');
  } catch (err) { next(err); }
});

router.delete('/posts/:id/like', authenticate, async (req, res, next) => {
  try {
    await db.like.deleteMany({ where: { postId: req.params.id, userId: req.user.id } });
    return success(res, null, 'Like removed');
  } catch (err) { next(err); }
});

router.get('/posts/:id/comments', authenticate, async (req, res, next) => {
  try {
    const comments = await db.comment.findMany({ where: { postId: req.params.id }, orderBy: { createdAt: 'asc' } });
    return success(res, comments);
  } catch (err) { next(err); }
});

router.post('/posts/:id/comments', authenticate, async (req, res, next) => {
  try {
    const comment = await db.comment.create({
      data: { postId: req.params.id, authorId: req.user.id, content: req.body.content },
    });
    return success(res, comment, 'Comment added', 201);
  } catch (err) { next(err); }
});

router.delete('/comments/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    await db.comment.delete({ where: { id: req.params.id } });
    return success(res, null, 'Comment deleted');
  } catch (err) { next(err); }
});

router.get('/reports', authenticate, authorize('admin'), async (_req, res, next) => {
  try {
    const reports = await db.report.findMany({ include: { post: true }, orderBy: { createdAt: 'desc' } });
    return success(res, reports);
  } catch (err) { next(err); }
});

router.post('/reports', authenticate, async (req, res, next) => {
  try {
    const report = await db.report.create({ data: { ...req.body, reporterId: req.user.id } });
    return success(res, report, 'Report submitted', 201);
  } catch (err) { next(err); }
});

router.patch('/posts/:id/moderate', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const post = await db.post.update({ where: { id: req.params.id }, data: { status: req.body.status } });
    return success(res, post, 'Post moderated');
  } catch (err) { next(err); }
});

module.exports = router;
