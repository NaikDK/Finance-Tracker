import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Grid,
  TextField, Button, Alert, CircularProgress, Divider
} from '@mui/material';
import { ArrowBack, LockOpen } from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { closeTrade, clearError } from '../store/slices/tradeSlice';
import { formatCurrency, formatDateTime } from '../utils/formatters';

const CloseTradePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, error, selectedTrade } = useSelector((state) => state.trades);

  const [form, setForm] = useState({
    exitPrice: '',
    exitCommission: '',
    exitDate: ''
  });

  const handleChange = (e) => {
    dispatch(clearError());
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      exitPrice: parseFloat(form.exitPrice),
      exitCommission: form.exitCommission ? parseFloat(form.exitCommission) : 0,
      exitDate: form.exitDate || null
    };
    const result = await dispatch(closeTrade({ id, closeData: payload }));
    if (closeTrade.fulfilled.match(result)) {
      navigate('/trades');
    }
  };

  return (
    <MainLayout>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/trades')} color="inherit">
          Back
        </Button>
        <Box>
          <Typography variant="h5">Close Trade</Typography>
          <Typography variant="body2" color="text.secondary">
            Enter exit details to close this position
          </Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>{error}</Alert>}

      <Grid container spacing={2}>

        {/* Trade Summary */}
        {selectedTrade && (
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" mb={2}>
                  OPEN POSITION
                </Typography>
                <Typography variant="h6" color="primary.light" fontWeight={700}>
                  {selectedTrade.ticker}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {selectedTrade.instrumentType} · {selectedTrade.type} · {selectedTrade.lots} lot(s)
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Entry Price</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formatCurrency(selectedTrade.entryPrice)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Entry Commission</Typography>
                  <Typography variant="body2">{formatCurrency(selectedTrade.entryCommission)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Entry Date</Typography>
                  <Typography variant="body2">{formatDateTime(selectedTrade.entryDate)}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Close Form */}
        <Grid item xs={12} md={selectedTrade ? 8 : 12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={2}>
                EXIT DETAILS
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth label="Exit Price" name="exitPrice" type="number"
                      value={form.exitPrice} onChange={handleChange}
                      required placeholder="0.00" inputProps={{ step: '0.01', min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth label="Exit Commission" name="exitCommission" type="number"
                      value={form.exitCommission} onChange={handleChange}
                      placeholder="1.06" inputProps={{ step: '0.01', min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth label="Exit Date" name="exitDate"
                      type="datetime-local" value={form.exitDate}
                      onChange={handleChange} InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                  <Button variant="outlined" color="inherit" onClick={() => navigate('/trades')}>
                    Cancel
                  </Button>
                  <Button
                    type="submit" variant="contained" color="warning"
                    disabled={loading} startIcon={<LockOpen />} sx={{ minWidth: 140 }}
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Close Trade'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </MainLayout>
  );
};

export default CloseTradePage;