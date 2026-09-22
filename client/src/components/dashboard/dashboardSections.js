/**
 * Named dashboard sections and role-based navigation.
 * Legacy ?tab=N maps to section ids so old deep links keep working.
 */

export const SECTIONS = {
  HOME: 'home',
  MANUSCRIPTS: 'manuscripts',
  SUBMIT: 'submit',
  VERIFY: 'verify',
  REVIEWS: 'reviews',
  BILLING: 'billing',
  PROFILE: 'profile',
  CREATE_JOURNAL: 'create-journal',
  MAILING: 'mailing',
  SUBMIT_ISSUE: 'submit-issue',
  REVIEWER_MGMT: 'reviewer-management',
};

/**
 * Build nav groups for the current role.
 * @returns {{ id: string, label: string, items: Array<{ id: string, label: string, badge?: number }> }[]}
 */
export function getNavGroups({ isAdmin, isReviewer, counts = {} }) {
  const {
    regularVerify = 0,
    specialVerify = 0,
  } = counts;

  if (isAdmin) {
    const groups = [
      {
        id: 'main',
        label: null,
        items: [{ id: SECTIONS.HOME, label: 'Home' }],
      },
      {
        id: 'verify',
        label: 'Verify',
        items: [
          {
            id: SECTIONS.VERIFY,
            label: 'Verification queue',
            badge: regularVerify + specialVerify,
          },
        ],
      },
      {
        id: 'mywork',
        label: 'My work',
        items: [
          { id: SECTIONS.MANUSCRIPTS, label: 'My manuscripts' },
          { id: SECTIONS.SUBMIT, label: 'Submit manuscript' },
        ],
      },
      {
        id: 'people',
        label: 'People',
        items: [
          { id: SECTIONS.REVIEWER_MGMT, label: 'Reviewer management' },
          ...(isReviewer
            ? [{ id: SECTIONS.REVIEWS, label: 'Review articles' }]
            : []),
        ],
      },
      {
        id: 'comms',
        label: 'Communications',
        items: [{ id: SECTIONS.MAILING, label: 'Mailing' }],
      },
      {
        id: 'publishing',
        label: 'Publishing',
        items: [
          { id: SECTIONS.SUBMIT_ISSUE, label: 'Submit issue' },
          { id: SECTIONS.CREATE_JOURNAL, label: 'Create journal' },
        ],
      },
      {
        id: 'account',
        label: 'Account',
        items: [
          { id: SECTIONS.BILLING, label: 'Billing' },
          { id: SECTIONS.PROFILE, label: 'Profile' },
        ],
      },
    ];
    return groups;
  }

  if (isReviewer) {
    return [
      {
        id: 'main',
        label: null,
        items: [{ id: SECTIONS.HOME, label: 'Home' }],
      },
      {
        id: 'work',
        label: 'Work',
        items: [
          {
            id: SECTIONS.VERIFY,
            label: 'Verify manuscripts',
            badge: regularVerify + specialVerify,
          },
          { id: SECTIONS.REVIEWS, label: 'Review articles' },
        ],
      },
      {
        id: 'account',
        label: 'Account',
        items: [
          { id: SECTIONS.BILLING, label: 'Billing' },
          { id: SECTIONS.PROFILE, label: 'Profile' },
        ],
      },
    ];
  }

  // Author
  return [
    {
      id: 'main',
      label: null,
      items: [{ id: SECTIONS.HOME, label: 'Home' }],
    },
    {
      id: 'work',
      label: 'Work',
      items: [
        { id: SECTIONS.MANUSCRIPTS, label: 'My manuscripts' },
        { id: SECTIONS.SUBMIT, label: 'Submit manuscript' },
      ],
    },
    {
      id: 'account',
      label: 'Account',
      items: [
        { id: SECTIONS.BILLING, label: 'Billing' },
        { id: SECTIONS.PROFILE, label: 'Profile' },
      ],
    },
  ];
}

/** Flat list of valid section ids for a role */
export function getValidSections(isAdmin, isReviewer) {
  const groups = getNavGroups({ isAdmin, isReviewer });
  return groups.flatMap((g) => g.items.map((i) => i.id));
}

/**
 * Map legacy ?tab=N to a section id for the given role.
 * Mirrors the old intended destinations (not the broken collision behaviour).
 */
export function mapLegacyTab(tabIndex, { isAdmin, isReviewer }) {
  const n = Number(tabIndex);
  if (Number.isNaN(n)) return SECTIONS.HOME;

  if (isAdmin) {
    // Approximate old admin tab intents
    const adminMap = {
      0: SECTIONS.VERIFY,
      1: SECTIONS.SUBMIT,
      2: SECTIONS.PROFILE,
      3: isReviewer ? SECTIONS.REVIEWS : SECTIONS.BILLING,
      4: SECTIONS.CREATE_JOURNAL,
      5: SECTIONS.MAILING,
      6: SECTIONS.VERIFY,
      7: SECTIONS.SUBMIT_ISSUE,
      8: SECTIONS.MANUSCRIPTS,
      9: SECTIONS.REVIEWER_MGMT,
      10: SECTIONS.BILLING,
    };
    return adminMap[n] ?? SECTIONS.HOME;
  }

  if (isReviewer) {
    const reviewerMap = {
      0: SECTIONS.VERIFY,
      1: SECTIONS.PROFILE, // was broken Edit Profile position
      2: SECTIONS.PROFILE,
      3: SECTIONS.REVIEWS,
      4: SECTIONS.BILLING,
      5: SECTIONS.BILLING,
      6: SECTIONS.VERIFY,
    };
    return reviewerMap[n] ?? SECTIONS.HOME;
  }

  // Author
  const authorMap = {
    0: SECTIONS.MANUSCRIPTS,
    1: SECTIONS.SUBMIT,
    2: SECTIONS.PROFILE,
    3: SECTIONS.BILLING,
    4: SECTIONS.BILLING,
  };
  return authorMap[n] ?? SECTIONS.HOME;
}

/**
 * Resolve the active section from search params.
 */
export function resolveSection(searchParams, { isAdmin, isReviewer }) {
  const named = searchParams.get('section');
  const valid = getValidSections(isAdmin, isReviewer);

  if (named && valid.includes(named)) {
    return named;
  }

  const tab = searchParams.get('tab');
  if (tab !== null && tab !== undefined && tab !== '') {
    const mapped = mapLegacyTab(tab, { isAdmin, isReviewer });
    if (valid.includes(mapped)) return mapped;
  }

  return SECTIONS.HOME;
}

export function getRoleLabel({ isAdmin, isReviewer }) {
  if (isAdmin) return 'Administrator';
  if (isReviewer) return 'Reviewer';
  return 'Author';
}

export function getPrimaryCta({ isAdmin, isReviewer }) {
  if (isReviewer && !isAdmin) {
    return { section: SECTIONS.VERIFY, label: 'Open verification queue' };
  }
  if (isAdmin) {
    return { section: SECTIONS.VERIFY, label: 'Open verification queue' };
  }
  return { section: SECTIONS.SUBMIT, label: 'Submit manuscript' };
}
