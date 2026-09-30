import { PrismaClient } from '@prisma/client';
import createError from '../utils/createError.js';

const prisma = new PrismaClient();

const parsePaging = (req) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(req.query.pageSize, 10) || 50, 1), 50);
  return { page, pageSize, skip: (page - 1) * pageSize };
};

const requireAdmin = (req, next) => {
  if (!req.isAdmin) {
    next(createError(403, 'Only admins can access this resource'));
    return false;
  }
  return true;
};

export const getAdminStats = async (req, res, next) => {
  if (!requireAdmin(req, next)) return;
  try {
    const nowUnix = Math.floor(Date.now() / 1000);
    const [
      usersJoined,
      reviewersJoined,
      reviewersPending,
      reviewersApproved,
      articlesSubmitted,
      articlesPublished,
      articlesInReview,
      articlesAccepted,
      paidArticles,
      articlePayments,
      subscriptionsTotal,
      activeSubscriptions,
      fullIssuePurchases,
      journalsCount,
      fullIssuePaymentRows,
    ] = await Promise.all([
      prisma.user.count({ where: { userType: 'user' } }),
      prisma.user.count({ where: { userType: 'reviewer' } }),
      prisma.user.count({ where: { userType: 'reviewer', reviewerApproved: false } }),
      prisma.user.count({ where: { userType: 'reviewer', reviewerApproved: true } }),
      prisma.article.count(),
      prisma.article.count({ where: { isPublished: true } }),
      prisma.article.count({ where: { isReview: true, isPublished: false, isAccepted: false } }),
      prisma.article.count({ where: { isAccepted: true, isPublished: false } }),
      prisma.article.count({ where: { paymentStatus: true } }),
      prisma.article.aggregate({
        where: { paymentStatus: true },
        _sum: { paymentAmount: true },
      }),
      prisma.subscription.count(),
      prisma.subscription.count({
        where: { isSubscribed: true, subscriptionPeriodEnd: { gt: nowUnix } },
      }),
      prisma.userFullIssue.count(),
      prisma.journal.count(),
      prisma.userFullIssue.findMany({
        select: { amountTotal: true },
      }),
    ]);

    const fullIssueRevenueMinor = fullIssuePaymentRows.reduce((sum, row) => {
      const raw = row.amountTotal;
      if (raw == null) return sum;
      const parsed = Number(typeof raw === 'string' ? JSON.parse(raw) : raw);
      return sum + (Number.isFinite(parsed) ? parsed : 0);
    }, 0);

    return res.status(200).json({
      usersJoined,
      reviewersJoined,
      reviewersPending,
      reviewersApproved,
      articlesSubmitted,
      articlesPublished,
      articlesInReview,
      articlesAccepted,
      paidArticles,
      articlePaymentTotalMinor: articlePayments._sum.paymentAmount || 0,
      subscriptionsTotal,
      activeSubscriptions,
      fullIssuePurchases,
      fullIssueRevenueMinor,
      journalsCount,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAdminUsers = async (req, res, next) => {
  if (!requireAdmin(req, next)) return;
  try {
    const { page, pageSize, skip } = parsePaging(req);
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const where = {
      userType: 'user',
      ...(q
        ? {
            OR: [
              { email: { contains: q } },
              { surname: { contains: q } },
              { otherName: { contains: q } },
              { affiliation: { contains: q } },
            ],
          }
        : {}),
    };

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          title: true,
          surname: true,
          otherName: true,
          affiliation: true,
          emailVerified: true,
          createdAt: true,
          _count: { select: { articles: true } },
        },
      }),
    ]);

    return res.status(200).json({
      page,
      pageSize,
      total,
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        name: [u.title, u.otherName, u.surname].filter(Boolean).join(' '),
        affiliation: u.affiliation,
        emailVerified: u.emailVerified,
        articlesCount: u._count.articles,
        createdAt: u.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAdminReviewers = async (req, res, next) => {
  if (!requireAdmin(req, next)) return;
  try {
    const { page, pageSize, skip } = parsePaging(req);
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const status =
      typeof req.query.status === 'string' ? req.query.status.trim().toLowerCase() : 'all';

    const where = {
      userType: 'reviewer',
      ...(status === 'pending' ? { reviewerApproved: false } : {}),
      ...(status === 'approved' ? { reviewerApproved: true } : {}),
      ...(q
        ? {
            OR: [
              { email: { contains: q } },
              { surname: { contains: q } },
              { otherName: { contains: q } },
              { affiliation: { contains: q } },
            ],
          }
        : {}),
    };

    const [total, reviewers] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          title: true,
          surname: true,
          otherName: true,
          affiliation: true,
          cvUrl: true,
          reviewerApproved: true,
          createdAt: true,
          _count: { select: { reviewerAcceptedArticles: true } },
        },
      }),
    ]);

    return res.status(200).json({
      page,
      pageSize,
      total,
      reviewers: reviewers.map((r) => ({
        id: r.id,
        email: r.email,
        name: [r.title, r.otherName, r.surname].filter(Boolean).join(' '),
        affiliation: r.affiliation,
        cvUrl: r.cvUrl,
        reviewerApproved: r.reviewerApproved,
        acceptedArticlesCount: r._count.reviewerAcceptedArticles,
        createdAt: r.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAdminArticles = async (req, res, next) => {
  if (!requireAdmin(req, next)) return;
  try {
    const { page, pageSize, skip } = parsePaging(req);
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const status =
      typeof req.query.status === 'string' ? req.query.status.trim().toLowerCase() : '';

    const where = {
      ...(status === 'published' ? { isPublished: true } : {}),
      ...(status === 'in_review' ? { isReview: true, isPublished: false, isAccepted: false } : {}),
      ...(status === 'accepted' ? { isAccepted: true, isPublished: false } : {}),
      ...(status === 'paid' ? { paymentStatus: true } : {}),
      ...(q
        ? {
            OR: [
              { articleTitle: { contains: q } },
              { articlePublishedUser: { email: { contains: q } } },
              { articlePublishedJournal: { journalTitle: { contains: q } } },
            ],
          }
        : {}),
    };

    const [total, articles] = await Promise.all([
      prisma.article.count({ where }),
      prisma.article.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          articleTitle: true,
          articleStatus: true,
          articleIssue: true,
          articleVolume: true,
          paymentStatus: true,
          paymentAmount: true,
          paymentCurrency: true,
          paymentDate: true,
          accessModel: true,
          isPublished: true,
          isAccepted: true,
          isReview: true,
          createdAt: true,
          articlePublishedJournal: {
            select: { journalTitle: true, journalAbbreviation: true },
          },
          articlePublishedUser: {
            select: { email: true, surname: true, otherName: true, title: true },
          },
        },
      }),
    ]);

    return res.status(200).json({
      page,
      pageSize,
      total,
      articles: articles.map((a) => ({
        id: a.id,
        title: a.articleTitle,
        status: a.articleStatus,
        issue: a.articleIssue,
        volume: a.articleVolume,
        paymentStatus: a.paymentStatus,
        paymentAmount: a.paymentAmount,
        paymentCurrency: a.paymentCurrency,
        paymentDate: a.paymentDate,
        accessModel: a.accessModel,
        isPublished: a.isPublished,
        isAccepted: a.isAccepted,
        isReview: a.isReview,
        journalTitle: a.articlePublishedJournal?.journalTitle || null,
        journalAbbreviation: a.articlePublishedJournal?.journalAbbreviation || null,
        submitterEmail: a.articlePublishedUser?.email || null,
        submitterName: a.articlePublishedUser
          ? [a.articlePublishedUser.title, a.articlePublishedUser.otherName, a.articlePublishedUser.surname]
              .filter(Boolean)
              .join(' ')
          : null,
        createdAt: a.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAdminPayments = async (req, res, next) => {
  if (!requireAdmin(req, next)) return;
  try {
    const { page, pageSize, skip } = parsePaging(req);

    const [total, rows] = await Promise.all([
      prisma.article.count({ where: { paymentStatus: true } }),
      prisma.article.findMany({
        where: { paymentStatus: true },
        skip,
        take: pageSize,
        orderBy: { paymentDate: 'desc' },
        select: {
          id: true,
          articleTitle: true,
          paymentAmount: true,
          paymentCurrency: true,
          paymentDate: true,
          paymentIntent: true,
          invoiceUrl: true,
          accessModel: true,
          articlePublishedUser: { select: { email: true, surname: true, otherName: true } },
          articlePublishedJournal: { select: { journalTitle: true } },
        },
      }),
    ]);

    return res.status(200).json({
      page,
      pageSize,
      total,
      payments: rows.map((row) => ({
        id: row.id,
        articleTitle: row.articleTitle,
        paymentAmount: row.paymentAmount,
        paymentCurrency: row.paymentCurrency,
        paymentDate: row.paymentDate,
        paymentIntent: row.paymentIntent,
        invoiceUrl: row.invoiceUrl,
        accessModel: row.accessModel,
        payerEmail: row.articlePublishedUser?.email || null,
        payerName: row.articlePublishedUser
          ? [row.articlePublishedUser.otherName, row.articlePublishedUser.surname].filter(Boolean).join(' ')
          : null,
        journalTitle: row.articlePublishedJournal?.journalTitle || null,
      })),
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAdminSubscriptions = async (req, res, next) => {
  if (!requireAdmin(req, next)) return;
  try {
    const { page, pageSize, skip } = parsePaging(req);
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const nowUnix = Math.floor(Date.now() / 1000);
    const activeOnly = String(req.query.active || '') === 'true';

    const where = {
      ...(activeOnly ? { isSubscribed: true, subscriptionPeriodEnd: { gt: nowUnix } } : {}),
      ...(q
        ? {
            OR: [
              { subscriptionEmail: { contains: q } },
              { invoiceId: { contains: q } },
              { customerId: { contains: q } },
            ],
          }
        : {}),
    };

    const [total, subscriptions] = await Promise.all([
      prisma.subscription.count({ where }),
      prisma.subscription.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, surname: true, otherName: true, title: true, email: true },
          },
        },
      }),
    ]);

    return res.status(200).json({
      page,
      pageSize,
      total,
      subscriptions: subscriptions.map((s) => ({
        id: s.id,
        email: s.subscriptionEmail,
        isSubscribed: s.isSubscribed,
        amountMinor: s.subscriptionAmmount,
        periodStart: s.subscriptionPeriodStart,
        periodEnd: s.subscriptionPeriodEnd,
        isActive: Boolean(s.isSubscribed && s.subscriptionPeriodEnd > nowUnix),
        invoiceId: s.invoiceId,
        customerId: s.customerId,
        invoiceUrl: s.hosted_invoice_url,
        invoicePdf: s.hosted_invoice_pdf,
        userName: s.user
          ? [s.user.title, s.user.otherName, s.user.surname].filter(Boolean).join(' ')
          : null,
        createdAt: s.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getAdminFullIssuePurchases = async (req, res, next) => {
  if (!requireAdmin(req, next)) return;
  try {
    const { page, pageSize, skip } = parsePaging(req);

    const [total, rows] = await Promise.all([
      prisma.userFullIssue.count(),
      prisma.userFullIssue.findMany({
        skip,
        take: pageSize,
        orderBy: { payment_intent: 'desc' },
        include: {
          user: { select: { email: true, surname: true, otherName: true, title: true } },
          fullIssue: {
            select: {
              issueVolume: true,
              issueNumber: true,
              issuePrice: true,
              issueJournal: { select: { journalTitle: true, journalAbbreviation: true } },
            },
          },
        },
      }),
    ]);

    return res.status(200).json({
      page,
      pageSize,
      total,
      purchases: rows.map((row) => {
        let amountMinor = null;
        try {
          amountMinor =
            row.amountTotal == null
              ? null
              : Number(typeof row.amountTotal === 'string' ? JSON.parse(row.amountTotal) : row.amountTotal);
        } catch {
          amountMinor = Number(row.amountTotal) || null;
        }
        return {
          paymentIntent: row.payment_intent,
          amountMinor: Number.isFinite(amountMinor) ? amountMinor : null,
          currency: row.amountCurrency,
          invoiceUrl: row.invoice_url,
          userEmail: row.user?.email || null,
          userName: row.user
            ? [row.user.title, row.user.otherName, row.user.surname].filter(Boolean).join(' ')
            : null,
          journalTitle: row.fullIssue?.issueJournal?.journalTitle || null,
          journalAbbreviation: row.fullIssue?.issueJournal?.journalAbbreviation || null,
          volume: row.fullIssue?.issueVolume ?? null,
          issue: row.fullIssue?.issueNumber ?? null,
        };
      }),
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
