import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Grid, Card, CardContent,
  CircularProgress, Alert, Divider
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie,
  Cell, Legend
} from 'recharts';
import MainLayout from '../components/layout/MainLayout';
import { fetchPortfolioSummary } from '../store/slices/tradeSlice';
import { formatCurrency, formatPercent } from '../utils/formatters';

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ label, value, color }) => (
  <Card>
    <CardContent sx={{ p: 2.5 }}>
      <Typography variant="caption" color="text.secondary" textTransform="uppercase" letterSpacing={1}>
        {label}
      </Typography>
      <Typography variant="h5" fontWeight={700} color={color || 'text.primary'} mt={0.5}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const CHART_COLORS = {
  profit: '#00E676',
  loss: '#FF1744',
  neutral: '#2196F3'
};

const PortfolioPage = () => {
  const dispatch = useDispatch();
  const { portfolio, portfolioLoading, error } = useSelector((state) => state.trades);

  useEffect(() => {
    dispatch(fetchPortfolioSummary());
  }, [dispatch]);

  if (portfolioLoading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Alert severity="error">{error}</Alert>
      </MainLayout>
    );
  }

  if (!portfolio) return <MainLayout><Box /></MainLayout>;

  // ─── Chart Data ───────────────────────────────────────────────────────────

  // Win/Loss Pie Chart
  const winLossData = [
    { name: 'Winning', value: portfolio.winningTrades, color: CHART_COLORS.profit },
    { name: 'Losing', value: portfolio.losingTrades, color: CHART_COLORS.loss }
  ];

  // Ticker Breakdown Bar Chart
  const tickerData = (portfolio.tickerBreakdown || []).map((t) => ({
    ticker: t.ticker,
    pnl: parseFloat(t.totalPnL),
    fill: parseFloat(t.totalPnL) >= 0 ? CHART_COLORS.profit : CHART_COLORS.loss
  }));

  const pnlColor = parseFloat(portfolio.totalPnL) >= 0
    ? 'success.main'
    : 'error.main';

  return (
    <MainLayout>
      <Typography variant="h5" mb={0.5}>Portfolio Summary</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Performance overview across all closed trades
      </Typography>

      {/* ── Key Stats ── */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard label="Total P&L" value={formatCurrency(portfolio.totalPnL)} color={pnlColor} />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard label="Win Rate" value={formatPercent(portfolio.winRate)} color="primary.light" />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard label="Total Trades" value={portfolio.totalTrades} />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard label="Open" value={portfolio.openTrades} color="primary.light" />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard label="Profit Factor" value={portfolio.profitFactor ?? '—'} />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard label="Expectancy" value={formatCurrency(portfolio.expectancy)} color={pnlColor} />
        </Grid>
      </Grid>

      {/* ── Secondary Stats ── */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6} sm={3}>
          <StatCard label="Avg Win" value={formatCurrency(portfolio.avgWin)} color="success.main" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard label="Avg Loss" value={formatCurrency(portfolio.avgLoss)} color="error.main" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard label="Largest Win" value={formatCurrency(portfolio.largestWin)} color="success.main" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard label="Largest Loss" value={formatCurrency(portfolio.largestLoss)} color="error.main" />
        </Grid>
      </Grid>

      {/* ── Charts ── */}
      <Grid container spacing={2}>

        {/* Win/Loss Pie Chart */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" mb={2}>
                WIN / LOSS RATIO
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={winLossData}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {winLossData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => [`${value} trades`]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Ticker P&L Bar Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" mb={2}>
                P&L BY TICKER
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={tickerData} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="ticker" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), 'P&L']}
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E293B' }}
                  />
                  <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                    {tickerData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* ── Ticker Breakdown Table ── */}
      {portfolio.tickerBreakdown?.length > 0 && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" mb={2}>
              TICKER BREAKDOWN
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {portfolio.tickerBreakdown.map((ticker) => (
              <Box
                key={ticker.ticker}
                sx={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', py: 1,
                  borderBottom: '1px solid #1E293B'
                }}
              >
                <Typography fontWeight={600} color="primary.light" width={80}>
                  {ticker.ticker}
                </Typography>
                <Typography variant="body2" color="text.secondary" width={80}>
                  {ticker.tradeCount} trades
                </Typography>
                <Typography variant="body2" color="text.secondary" width={80}>
                  {formatPercent(ticker.winRate)} WR
                </Typography>
                <Typography
                  fontWeight={600}
                  color={parseFloat(ticker.totalPnL) >= 0 ? 'success.main' : 'error.main'}
                >
                  {formatCurrency(ticker.totalPnL)}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

    </MainLayout>
  );
};

export default PortfolioPage;