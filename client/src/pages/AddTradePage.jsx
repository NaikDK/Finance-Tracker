import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Grid,
  TextField, Button, MenuItem, Alert,
  CircularProgress, Divider, Switch, FormControlLabel
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import MainLayout from '../components/layout/MainLayout';
import { createTrade, clearError } from '../store/slices/tradeSlice';

const INSTRUMENT_TYPES = ['OPTION', 'STOCK', 'FUTURES'];
const TRADE_TYPES = ['BUY', 'SELL'];

const initialForm = {
  ticker: '',
  type: 'BUY',
  instrumentType: 'OPTION',
  lots: 1,
  strike: '',
  contractExpiry: '',
  entryPrice: '',
  entryCommission: '',
  entryDate: '',
  exitPrice: '',
  exitCommission: '',
  exitDate: '',
  notes: ''
};

const AddTradePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useSelector((state) => state.trades);
  const [form, setForm] = useState(initialForm);
  const [closeOnCreate, setCloseOnCreate] = useState(false);

  const handleChange = (e) => {
    dispatch(clearError());
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build payload — only include exit fields if closing on create
    const payload = {
      ticker: form.ticker,
      type: form.type,
      instrumentType: form.instrumentType,
      lots: parseInt(form.lots),
      strike: form.strike ? parseFloat(form.strike) : null,
      contractExpiry: form.contractExpiry || null,
      entryPrice: parseFloat(form.entryPrice),
      entryCommission: form.entryCommission ? parseFloat(form.entryCommission) : 0,
      entryDate: form.entryDate || null,
      notes: form.notes || null
    };

    if (closeOnCreate) {
      payload.exitPrice = parseFloat(form.exitPrice);
      payload.exitCommission = form.exitCommission ? parseFloat(form.exitCommission) : 0;
      payload.exitDate = form.exitDate || null;
    }

    const result = await dispatch(createTrade(payload));
    if (createTrade.fulfilled.match(result)) {
      navigate('/trades');
    }
  };

  return (
    <MainLayout>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/trades')}
          color="inherit"
        >
          Back
        </Button>
        <Box>
          <Typography variant="h5">Add Trade</Typography>
          <Typography variant="body2" color="text.secondary">
            Record a new trade entry
          </Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>{error}</Alert>}

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>

            {/* Contract Info */}
            <Typography variant="subtitle2" color="text.secondary" mb={2}>
              CONTRACT DETAILS
            </Typography>
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth label="Ticker" name="ticker"
                  value={form.ticker} onChange={handleChange}
                  required placeholder="SPY"
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth select label="Type" name="type"
                  value={form.type} onChange={handleChange}
                >
                  {TRADE_TYPES.map(t => (
                    <MenuItem key={t} value={t}>{t}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth select label="Instrument" name="instrumentType"
                  value={form.instrumentType} onChange={handleChange}
                >
                  {INSTRUMENT_TYPES.map(t => (
                    <MenuItem key={t} value={t}>{t}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth label="Lots" name="lots" type="number"
                  value={form.lots} onChange={handleChange}
                  required inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth label="Strike Price" name="strike" type="number"
                  value={form.strike} onChange={handleChange}
                  placeholder="542.00"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth label="Contract Expiry" name="contractExpiry"
                  type="datetime-local" value={form.contractExpiry}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Entry Details */}
            <Typography variant="subtitle2" color="text.secondary" mb={2}>
              ENTRY
            </Typography>
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth label="Entry Price" name="entryPrice" type="number"
                  value={form.entryPrice} onChange={handleChange}
                  required placeholder="0.50"
                  inputProps={{ step: '0.01' }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth label="Commission" name="entryCommission" type="number"
                  value={form.entryCommission} onChange={handleChange}
                  placeholder="1.55" inputProps={{ step: '0.01' }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth label="Entry Date" name="entryDate"
                  type="datetime-local" value={form.entryDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Close on Create Toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={closeOnCreate}
                  onChange={(e) => setCloseOnCreate(e.target.checked)}
                  color="primary"
                />
              }
              label="Add exit details (close trade immediately)"
              sx={{ mb: 2 }}
            />

            {/* Exit Details — only shown if closing on create */}
            {closeOnCreate && (
              <>
                <Typography variant="subtitle2" color="text.secondary" mb={2}>
                  EXIT
                </Typography>
                <Grid container spacing={2} mb={3}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth label="Exit Price" name="exitPrice" type="number"
                      value={form.exitPrice} onChange={handleChange}
                      required={closeOnCreate} placeholder="0.00"
                      inputProps={{ step: '0.01' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth label="Commission" name="exitCommission" type="number"
                      value={form.exitCommission} onChange={handleChange}
                      placeholder="1.06" inputProps={{ step: '0.01' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth label="Exit Date" name="exitDate"
                      type="datetime-local" value={form.exitDate}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
              </>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Notes */}
            <TextField
              fullWidth label="Notes" name="notes" multiline rows={2}
              value={form.notes} onChange={handleChange}
              placeholder="Optional trade notes..."
              sx={{ mb: 3 }}
            />

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined" color="inherit"
                onClick={() => navigate('/trades')}
              >
                Cancel
              </Button>
              <Button
                type="submit" variant="contained"
                disabled={loading} sx={{ minWidth: 140 }}
              >
                {loading
                  ? <CircularProgress size={20} color="inherit" />
                  : closeOnCreate ? 'Add & Close Trade' : 'Add Trade'
                }
              </Button>
            </Box>

          </Box>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default AddTradePage;
