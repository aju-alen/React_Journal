import express from 'express';
import { verifyToken } from '../middleware/jwt.js';
import {
  getAdminStats,
  getAdminUsers,
  getAdminReviewers,
  getAdminArticles,
  getAdminPayments,
  getAdminSubscriptions,
  getAdminFullIssuePurchases,
} from '../controllers/admin.controller.js';
import { approveReviewer, rejectReviewer } from '../controllers/reviewer.controller.js';

const router = express.Router();

router.use(verifyToken);

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.get('/reviewers', getAdminReviewers);
router.get('/articles', getAdminArticles);
router.get('/payments', getAdminPayments);
router.get('/subscriptions', getAdminSubscriptions);
router.get('/full-issue-purchases', getAdminFullIssuePurchases);

router.post('/reviewers/:userId/approve', approveReviewer);
router.post('/reviewers/:userId/reject', rejectReviewer);

export default router;
