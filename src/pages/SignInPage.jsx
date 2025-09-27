import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SignInCard from '../components/auth/SignInCard';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    background:
      'linear-gradient(136deg, #1F3BAF 0%, #3B2AA9 45%, #5A229B 75%, #6C1F8C 100%)',
  },
  content: {
    width: '100%',
    maxWidth: 420,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(3.5),
  },
  header: {
    textAlign: 'center',
    color: theme.palette.common.white,
  },
  headerTitle: {
    fontWeight: 700,
    letterSpacing: '0.4px',
  },
  headerSubtitle: {
    marginTop: theme.spacing(1.5),
    opacity: 0.88,
    fontWeight: 400,
  },
}));

const SignInPage = ({ onSuccessfulSignIn }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (credentials) => {
      onSuccessfulSignIn?.(credentials);
      navigate('/home', { replace: true });
    },
    [navigate, onSuccessfulSignIn]
  );

  return (
    <Box className={classes.root}>
      <Box className={classes.content}>
        <Box className={classes.header}>
          <Typography variant="h3" className={classes.headerTitle}>
            GlobePulse
          </Typography>
          <Typography variant="subtitle1" className={classes.headerSubtitle}>
            Your 10-minute global news briefing
          </Typography>
        </Box>

        <SignInCard onSubmit={handleSubmit} />
      </Box>
    </Box>
  );
};

export default SignInPage;
