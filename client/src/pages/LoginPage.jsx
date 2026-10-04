import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Alert, CircularProgress, Divider,
  Tabs, Tab, InputAdornment, IconButton
} from '@mui/material';
import { DisplaySettings, TrendingUp, Visibility, VisibilityOff } from '@mui/icons-material';
import { signIn, signUp, clearError } from '../store/slices/authSlice';
import { display } from '@mui/system';

const SignInForm = ({ onSubmit, loading, onChange, form }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box component="form" onSubmit={onSubmit}>
      <TextField
        fullWidth label="Username or Email" name="username"
        value={form.username} onChange={onChange}
        margin="normal" required autoFocus
      />
      <TextField
        fullWidth label="Password" name="password"
        type={showPassword ? 'text' : 'password'}
        value={form.password} onChange={onChange}
        margin="normal" required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <Button
        type="submit" fullWidth variant="contained"
        size="large" disabled={loading}
        sx={{ mt: 3, mb: 1, py: 1.5 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
      </Button>
    </Box>
  )
};

const SignUpForm = ({ onSubmit, loading, onChange, form }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box component="form" onSubmit={onSubmit}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          fullWidth label="Full Name" name="name"
          value={form.name} onChange={onChange}
          margin="normal" required autoFocus
        />
        <TextField
          fullWidth label="Username" name="username"
          value={form.username} onChange={onChange}
          margin="normal" required
        />
      </Box>
      <TextField
        fullWidth label="Email" name="email"
        type="email" value={form.email}
        onChange={onChange} margin="normal" required
        helperText="e.g. user@example.com"
      />
      <TextField
        fullWidth label="Password" name="password"
        type={showPassword ? 'text' : 'password'}
        value={form.password} onChange={onChange}
        margin="normal" required
        helperText="Minimum 3 characters"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <TextField
        fullWidth label="Phone Number" name="phoneNumber"
        value={form.phoneNumber} onChange={onChange}
        margin="normal"
        helperText="10 digits, optional"
        inputProps={{ maxLength: 10 }}
      />
      <Button
        type="submit" fullWidth variant="contained"
        size="large" disabled={loading}
        sx={{ mt: 3, mb: 1, py: 1.5 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
      </Button>
    </Box>
  );
};

const initialSignIn = { username: '', password: '' };
const initialSignup = { name: '', username: '', email: '', password: '', phoneNumber: '' };

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [tab, settab] = useState(0);
  const [signInForm, setSignInForm] = useState(initialSignIn);
  const [signUpForm, setSignUpForm] = useState(initialSignup);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    dispatch(clearError());
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTabChange = (_, newValue) => {
    dispatch(clearError());
    settab(newValue);
  };

  const handleSignInChange = (e) => {
    dispatch(clearError());
    setSignInForm({ ...signInForm, [e.target.name]: e.target.value });
  };

  const handleSignUpChange = (e) => {
    dispatch(clearError());
    setSignUpForm({ ...signUpForm, [e.target.name]: e.target.value });
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    dispatch(signIn({ username: signInForm.username, password: signInForm.password }));
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    dispatch(signUp({
      name: signUpForm.name,
      username: signUpForm.username,
      email: signUpForm.email,
      password: signUpForm.password,
      phoneNumber: signUpForm.phoneNumber || null
    }));
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, #1565C022 0%, transparent 70%)'
      }}
    >
      <Card sx={{ width: 480, p: 2 }}>
        <CardContent>

          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 40, height: 40, borderRadius: 2,
                backgroundColor: 'primary.main',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <TrendingUp sx={{ color: 'white', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h6" lineHeight={1}>Naik Org</Typography>
              <Typography variant="caption" color="text.secondary">Trade Journal</Typography>
            </Box>
          </Box>

          {/* Tabs */}
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 3, borderBottom: '1px solid #1E293B' }}
          >
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error" sx={{ mb: 2 }}
              onClose={() => dispatch(clearError())}
            >
              {error}
            </Alert>
          )}

          {/* Forms */}
          {tab === 0 ? (
            <>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Welcome back — sign in to your account
              </Typography>
              <SignInForm
                onSubmit={handleSignIn}
                loading={loading}
                onChange={handleSignInChange}
                form={signInForm}
              />
            </>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Create your Naik Org account
              </Typography>
              <SignUpForm
                onSubmit={handleSignUp}
                loading={loading}
                onChange={handleSignUpChange}
                form={signUpForm}
              />
            </>
          )}

          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
            Naik Org Enterprise — Trade Journal v1.0
          </Typography>

        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;