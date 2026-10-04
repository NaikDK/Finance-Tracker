import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Chip, IconButton,
  Tabs, Tab, Alert, CircularProgress, Tooltip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add, LockOpen, Refresh } from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { fetchAllTrades, setSelectedTrade } from '../store/slices/tradeSlice';
import {
  formatCurrency, formatDateTime,
  getPnLColor, getStatusColor
} from '../utils/formatters';

const TradesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { trades, loading, error } = useSelector((state) => state.trades);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(fetchAllTrades());
  }, [dispatch]);

  // Filter trades by tab
  const filteredTrades = trades.filter((trade) => {
    if (tabValue === 0) return true;
    if (tabValue === 1) return trade.status === 'OPEN';
    if (tabValue === 2) return trade.status === 'CLOSED';
    return true;
  });

  const handleCloseTrade = (trade) => {
    dispatch(setSelectedTrade(trade));
    navigate(`/trades/close/${trade.id}`);
  };

  // ─── DataGrid Columns ─────────────────────────────────────────────────────
  const columns = [
    {
      field: 'entryDate',
      headerName: 'Date',
      width: 160,
      renderCell: (params) => formatDateTime(params.value)
    },
    {
      field: 'ticker',
      headerName: 'Ticker',
      width: 80,
      renderCell: (params) => (
        <Typography fontWeight={600} color="primary.light">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'contract',
      headerName: 'Contract',
      width: 120
    },
    {
      field: 'type',
      headerName: 'B/S',
      width: 70,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === 'BUY' ? 'success' : 'error'}
          variant="outlined"
          sx={{ fontSize: '0.7rem', height: 22 }}
        />
      )
    },
    {
      field: 'lots',
      headerName: 'Qty',
      width: 60,
      align: 'right',
      headerAlign: 'right'
    },
    {
      field: 'entryPrice',
      headerName: 'Entry',
      width: 90,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => formatCurrency(params.value)
    },
    {
      field: 'entryCommission',
      headerName: 'Comm',
      width: 80,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => formatCurrency(params.value)
    },
    {
      field: 'exitPrice',
      headerName: 'Exit',
      width: 90,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => formatCurrency(params.value)
    },
    {
      field: 'exitCommission',
      headerName: 'Exit Comm',
      width: 90,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => formatCurrency(params.value)
    },
    {
      field: 'totalCommission',
      headerName: 'Total Comm',
      width: 100,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => formatCurrency(params.value)
    },
    {
      field: 'PnL',
      headerName: 'P&L',
      width: 100,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Typography
          fontSize="0.85rem"
          fontWeight={600}
          color={getPnLColor(params.value)}
        >
          {formatCurrency(params.value)}
        </Typography>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 90,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={getStatusColor(params.value)}
          sx={{ fontSize: '0.7rem', height: 22 }}
        />
      )
    },
    {
      field: 'notes',
      headerName: 'Notes',
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary" noWrap>
          {params.value || '—'}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      renderCell: (params) => (
        params.row.status === 'OPEN' ? (
          <Tooltip title="Close trade">
            <IconButton
              size="small"
              color="warning"
              onClick={() => handleCloseTrade(params.row)}
            >
              <LockOpen fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : null
      )
    }
  ];

  return (
    <MainLayout>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5">Trade Journal</Typography>
          <Typography variant="body2" color="text.secondary">
            {trades.length} total trades
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh">
            <IconButton onClick={() => dispatch(fetchAllTrades())} disabled={loading}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/trades/new')}
          >
            Add Trade
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Filter Tabs */}
      <Tabs
        value={tabValue}
        onChange={(_, val) => setTabValue(val)}
        sx={{ mb: 2 }}
      >
        <Tab label={`All (${trades.length})`} />
        <Tab label={`Open (${trades.filter(t => t.status === 'OPEN').length})`} />
        <Tab label={`Closed (${trades.filter(t => t.status === 'CLOSED').length})`} />
      </Tabs>

      {/* Trade Table */}
      <Box sx={{ height: 'calc(100vh - 230px)', backgroundColor: 'background.paper', borderRadius: 2 }}>
        <DataGrid
          rows={filteredTrades}
          columns={columns}
          getRowId={(row) => row.id}
          loading={loading}
          pageSizeOptions={[25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } }
          }}
          disableRowSelectionOnClick
          sx={{ border: 'none' }}
        />
      </Box>
    </MainLayout>
  );
};

export default TradesPage;