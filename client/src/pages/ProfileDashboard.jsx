import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { httpRoute } from '../helperFunctions';
import SubmitManuscript from '../components/SubmitManuscript';
import MyManuscriptsDashboard from '../components/MyManuscriptsDashboard';
import AdminMyManuscriptsDashboard from '../components/AdminMyManuscriptsDashboard';
import EditProfile from '../components/EditProfile';
import SubmitIssue from '../components/SubmitIssue';
import CreateNewJournal from '../components/CreateNewJournal';
import CreateMarkettingEmail from '../components/CreateMarkettingEmail';
import ReviewerManagement from '../components/ReviewerManagement';
import ReviewerArticleDashboard from '../components/ReviewerArticleDashboard';
import ManagePurchase from '../components/ManagePurchase';
import StripeManageSubscription from '../components/StripeManageSubscription';
import DashboardShell from '../components/dashboard/DashboardShell';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import {
  SECTIONS,
  getNavGroups,
  resolveSection,
} from '../components/dashboard/dashboardSections';
import { dashboardColors } from '../utils/theme';

const ProfileDashboard = () => {
  const { profileId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [userDetails, setUserDetails] = useState({});
  const [user, setUser] = useState({});
  const [verificationArticle, setVerificationArticle] = useState([]);
  const [userSpecialReview, setUserSpecialReview] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [userSpecialReviewCount, setUserSpecialReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [verifyFilter, setVerifyFilter] = useState('regular');

  const isAdmin = Boolean(userDetails?.user?.isAdmin);
  const isReviewer =
    userDetails?.user?.userType === 'reviewer' &&
    Boolean(userDetails?.user?.reviewerApproved);

  const activeSection = useMemo(
    () => resolveSection(searchParams, { isAdmin, isReviewer }),
    [searchParams, isAdmin, isReviewer]
  );

  const navGroups = useMemo(
    () =>
      getNavGroups({
        isAdmin,
        isReviewer,
        counts: {
          regularVerify: userCount,
          specialVerify: userSpecialReviewCount,
        },
      }),
    [isAdmin, isReviewer, userCount, userSpecialReviewCount]
  );

  const navigateToSection = useCallback(
    (sectionId) => {
      setSearchParams((params) => {
        const next = new URLSearchParams(params);
        next.delete('tab');
        next.set('section', sectionId);
        return next;
      });
    },
    [setSearchParams]
  );

  const refreshVerificationArticles = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem('currentUser'));
        setUserDetails(stored || {});
        if (!stored?.token) {
          setLoading(false);
          return;
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${stored.token}`;

        const resp = await axios.get(`${httpRoute}/api/users/${profileId}`);
        setUser(resp.data);

        if (
          resp.data.isAdmin ||
          (resp.data.userType === 'reviewer' && resp.data.reviewerApproved)
        ) {
          const verifyResp = await axios.get(
            `${httpRoute}/api/journalArticle/verifyArticles/${profileId}`
          );
          const regular = verifyResp.data.filter((item) => item.specialReview === false);
          const special = verifyResp.data.filter((item) => item.specialReview === true);
          setVerificationArticle(regular);
          setUserCount(regular.length);
          setUserSpecialReview(special);
          setUserSpecialReviewCount(special.length);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [profileId, refreshKey]);

  // When landing via legacy ?tab=, rewrite URL to ?section=
  useEffect(() => {
    if (loading) return;
    const tab = searchParams.get('tab');
    const section = searchParams.get('section');
    if (tab !== null && tab !== '' && !section) {
      setSearchParams(
        (params) => {
          const next = new URLSearchParams(params);
          next.delete('tab');
          next.set('section', activeSection);
          return next;
        },
        { replace: true }
      );
    }
  }, [loading, searchParams, activeSection, setSearchParams]);

  const manuscriptCount = Array.isArray(user?.articles) ? user.articles.length : undefined;

  const renderSection = () => {
    switch (activeSection) {
      case SECTIONS.HOME:
        return (
          <DashboardOverview
            isAdmin={isAdmin}
            isReviewer={isReviewer}
            counts={{
              regularVerify: userCount,
              specialVerify: userSpecialReviewCount,
              manuscripts: manuscriptCount,
            }}
            onNavigate={navigateToSection}
          />
        );

      case SECTIONS.MANUSCRIPTS:
        return <MyManuscriptsDashboard user={user} onNavigate={navigateToSection} />;

      case SECTIONS.SUBMIT:
        return <SubmitManuscript user={user} />;

      case SECTIONS.VERIFY:
        return (
          <Box>
            <Typography
              variant="h5"
              component="h2"
              sx={{ fontWeight: 600, color: dashboardColors.ink, mb: 2 }}
            >
              Verification queue
            </Typography>
            <ToggleButtonGroup
              value={verifyFilter}
              exclusive
              onChange={(_, next) => {
                if (next) setVerifyFilter(next);
              }}
              size="small"
              sx={{ mb: 2 }}
              aria-label="Issue type filter"
            >
              <ToggleButton value="regular">
                Regular ({userCount})
              </ToggleButton>
              <ToggleButton value="special">
                Special ({userSpecialReviewCount})
              </ToggleButton>
            </ToggleButtonGroup>
            {verifyFilter === 'regular' ? (
              <AdminMyManuscriptsDashboard
                user={verificationArticle}
                onDelete={refreshVerificationArticles}
              />
            ) : (
              <AdminMyManuscriptsDashboard
                user={userSpecialReview}
                onDelete={refreshVerificationArticles}
              />
            )}
          </Box>
        );

      case SECTIONS.REVIEWS:
        return <ReviewerArticleDashboard />;

      case SECTIONS.BILLING:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <ManagePurchase />
            <StripeManageSubscription />
          </Box>
        );

      case SECTIONS.PROFILE:
        return <EditProfile userDetails={userDetails} />;

      case SECTIONS.CREATE_JOURNAL:
        return <CreateNewJournal />;

      case SECTIONS.MAILING:
        return <CreateMarkettingEmail />;

      case SECTIONS.SUBMIT_ISSUE:
        return <SubmitIssue />;

      case SECTIONS.REVIEWER_MGMT:
        return <ReviewerManagement />;

      default:
        return (
          <DashboardOverview
            isAdmin={isAdmin}
            isReviewer={isReviewer}
            counts={{
              regularVerify: userCount,
              specialVerify: userSpecialReviewCount,
              manuscripts: manuscriptCount,
            }}
            onNavigate={navigateToSection}
          />
        );
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          p: 4,
          pt: { xs: 12, sm: 14, md: 16 },
          backgroundColor: dashboardColors.canvas,
          minHeight: '60vh',
        }}
      >
        <Skeleton variant="rounded" height={72} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton variant="rounded" width={260} height={320} sx={{ display: { xs: 'none', md: 'block' } }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="rounded" height={120} sx={{ mb: 2 }} />
            <Skeleton variant="rounded" height={200} />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <DashboardShell
      userDetails={userDetails}
      isAdmin={isAdmin}
      isReviewer={isReviewer}
      navGroups={navGroups}
      activeSection={activeSection}
      onNavigate={navigateToSection}
    >
      {renderSection()}
    </DashboardShell>
  );
};

export default ProfileDashboard;
