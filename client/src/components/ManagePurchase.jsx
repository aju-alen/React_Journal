import React, { useEffect, useState } from 'react';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { httpRoute } from '../helperFunctions';
import DashboardTable from './dashboard/DashboardTable';
import { dashboardColors } from '../utils/theme';

const formatPaymentAmount = (amount, currency) => {
  if (amount == null) return '—';
  const formattedAmount = (amount / 100).toFixed(2);
  const formattedCurrency = currency ? currency.toUpperCase() : '';
  return formattedCurrency ? `${formattedCurrency} ${formattedAmount}` : formattedAmount;
};

const formatPaymentDate = (paymentDate) => {
  if (!paymentDate) return '—';
  return new Date(paymentDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const invoiceButtonSx = {
  borderColor: '#2e7d32',
  color: '#1b5e20',
  '&:hover': {
    backgroundColor: '#e8f5e9',
    borderColor: '#1b5e20',
  },
};

const ManagePurchase = () => {
  const [userId, setUserId] = useState('');
  const [fullIssues, setFullIssues] = useState([]);
  const [manuscriptPayments, setManuscriptPayments] = useState([]);
  const [loadingManuscripts, setLoadingManuscripts] = useState(true);
  const [loadingIssues, setLoadingIssues] = useState(true);

  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem('currentUser'));
    setUserId(getUser?.user?.id);
  }, []);

  useEffect(() => {
    const getAllPurchasedIssues = async () => {
      try {
        setLoadingIssues(true);
        const res = await axios.get(`${httpRoute}/api/user-fullissue/getfullissue`);
        setFullIssues(res.data.fullIssuePurchasedUser || []);
      } catch (err) {
        console.error(err);
        setFullIssues([]);
      } finally {
        setLoadingIssues(false);
      }
    };
    getAllPurchasedIssues();
  }, []);

  useEffect(() => {
    const getManuscriptPayments = async () => {
      if (!userId) {
        setLoadingManuscripts(false);
        return;
      }
      try {
        setLoadingManuscripts(true);
        const res = await axios.get(`${httpRoute}/api/users/${userId}`);
        const paidArticles = (res.data?.articles || []).filter(
          (article) => article.paymentStatus
        );
        setManuscriptPayments(paidArticles);
      } catch (err) {
        console.error(err);
        setManuscriptPayments([]);
      } finally {
        setLoadingManuscripts(false);
      }
    };
    getManuscriptPayments();
  }, [userId]);

  return (
    <Box>
      <Typography
        variant="h5"
        component="h2"
        sx={{ fontWeight: 600, color: dashboardColors.ink, mb: 2 }}
      >
        Manuscript payments
      </Typography>
      <DashboardTable
        loading={loadingManuscripts}
        empty={!loadingManuscripts && manuscriptPayments.length === 0}
        emptyTitle="No manuscript payments yet"
        emptyHint="Paid manuscript invoices will appear here."
        ariaLabel="manuscript payments"
        minWidth={650}
      >
        <TableHead>
          <TableRow>
            <TableCell>Payment id</TableCell>
            <TableCell>Article title</TableCell>
            <TableCell align="center">Amount</TableCell>
            <TableCell align="center">Purchase date</TableCell>
            <TableCell align="center">Invoice</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {manuscriptPayments.map((row) => (
            <TableRow key={row.paymentIntent || row.id}>
              <TableCell
                component="th"
                scope="row"
                sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '0.8rem' }}
              >
                {row.paymentIntent || '—'}
              </TableCell>
              <TableCell sx={{ fontWeight: 500 }}>{row.articleTitle}</TableCell>
              <TableCell align="center" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                {formatPaymentAmount(row.paymentAmount, row.paymentCurrency)}
              </TableCell>
              <TableCell align="center">{formatPaymentDate(row.paymentDate)}</TableCell>
              <TableCell align="center">
                {row.invoiceUrl ? (
                  <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    href={row.invoiceUrl}
                    target="_blank"
                    rel="noreferrer"
                    startIcon={<ReceiptLongIcon sx={{ fontSize: 16 }} />}
                    sx={invoiceButtonSx}
                  >
                    Invoice
                  </Button>
                ) : (
                  '—'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DashboardTable>

      <Typography
        variant="h5"
        component="h2"
        sx={{ fontWeight: 600, color: dashboardColors.ink, mt: 4, mb: 2 }}
      >
        Full issue purchases
      </Typography>
      <DashboardTable
        loading={loadingIssues}
        empty={!loadingIssues && (!fullIssues || fullIssues.length === 0)}
        emptyTitle="No full issue purchases yet"
        emptyHint="Purchased journal issues will appear here."
        ariaLabel="full issue purchases"
        minWidth={650}
      >
        <TableHead>
          <TableRow>
            <TableCell>Payment intent</TableCell>
            <TableCell align="center">Volume</TableCell>
            <TableCell align="center">Number</TableCell>
            <TableCell align="center">PDF</TableCell>
            <TableCell align="center">Invoice</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fullIssues?.map((row) => (
            <TableRow key={row.payment_intent}>
              <TableCell
                component="th"
                scope="row"
                sx={{ fontVariantNumeric: 'tabular-nums', fontSize: '0.8rem' }}
              >
                {row.payment_intent}
              </TableCell>
              <TableCell align="center">{row.fullIssue?.issueVolume}</TableCell>
              <TableCell align="center">{row.fullIssue?.issueNumber}</TableCell>
              <TableCell align="center">
                {row.fullIssue?.issueDoccumentURL ? (
                  <Button
                    href={row.fullIssue.issueDoccumentURL}
                    target="_blank"
                    rel="noreferrer"
                    size="small"
                    startIcon={<DescriptionOutlinedIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      color: dashboardColors.ink,
                      backgroundColor: dashboardColors.peach,
                      '&:hover': { backgroundColor: '#e8d5cc' },
                    }}
                  >
                    Download PDF
                  </Button>
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell align="center">
                {row.invoice_url ? (
                  <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    href={row.invoice_url}
                    target="_blank"
                    rel="noreferrer"
                    startIcon={<ReceiptLongIcon sx={{ fontSize: 16 }} />}
                    sx={invoiceButtonSx}
                  >
                    Invoice
                  </Button>
                ) : (
                  '—'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DashboardTable>
    </Box>
  );
};

export default ManagePurchase;
