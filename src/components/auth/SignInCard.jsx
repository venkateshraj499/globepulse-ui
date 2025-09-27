import { useMemo, useState } from 'react';
import { Button, Link, Paper, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const EMAIL_PATTERN =
  /^(?:[a-zA-Z0-9_'^&.+-])+(?:\.(?:[a-zA-Z0-9_'^&.+-])+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

const useStyles = makeStyles((theme) => ({
  card: {
    width: '100%',
    padding: theme.spacing(4.5, 4.75, 5),
    borderRadius: 22,
    boxShadow:
      '0px 25px 50px -12px rgba(30, 33, 58, 0.35), 0px 12px 25px rgba(30, 33, 58, 0.08)',
  },
  cardTitle: {
    fontWeight: 600,
    marginBottom: '26px !important',
    color: '#1B1B2F',
  },
  textField: {
    marginBottom: '20px !important',
    '& .MuiOutlinedInput-root': {
      borderRadius: 12,
      backgroundColor: theme.palette.common.white,
      transition: 'box-shadow 160ms ease, border 160ms ease',
      '& fieldset': {
        borderColor: '#D0D5DD',
      },
      '&:hover fieldset': {
        borderColor: '#9DA3B7',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#4C5EFF',
        borderWidth: 1.5,
      },
    },
    '& .MuiInputBase-input': {
      padding: theme.spacing(1.6, 1.9),
      fontSize: 15,
    },
    '& .MuiFormHelperText-root': {
      marginTop: theme.spacing(1),
      marginLeft: 0,
      fontSize: 13,
      fontWeight: 500,
      color: '#D92D20',
    },
  },
  submitButton: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1.5),
    borderRadius: 12,
    textTransform: 'none',
    fontSize: 16,
    fontWeight: 600,
    backgroundColor: '#121826',
    '&:hover': {
      backgroundColor: '#0C111D',
    },
  },
  helper: {
    fontSize: 13,
    marginTop: `${theme.spacing(2.5)} !important`,
    color: '#5C647B',
    textAlign: 'center',
  },
  successBadge: {
    marginTop: `${theme.spacing(2.5)} !important`,
    padding: theme.spacing(1.25, 1.75),
    borderRadius: 10,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    color: '#166534',
    fontSize: 14,
    fontWeight: 500,
    textAlign: 'center',
  },
}));

const INITIAL_FORM = {
  email: '',
  password: '',
};

export function validateSignIn(values) {
  const validationErrors = {};

  if (!values.email?.trim()) {
    validationErrors.email = 'Email is required';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    validationErrors.email = 'Enter a valid email address';
  }

  if (!values.password) {
    validationErrors.password = 'Password is required';
  } else if (values.password.length < 8) {
    validationErrors.password = 'Use at least 8 characters';
  }

  return validationErrors;
}

const SignInCard = ({ onSubmit }) => {
  const classes = useStyles();
  const [values, setValues] = useState(INITIAL_FORM);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => validateSignIn(values), [values]);
  const hasErrors = Object.keys(errors).length > 0;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const dirtyFields = { email: true, password: true };
    setTouched(dirtyFields);

    if (hasErrors) {
      setSubmitted(false);
      return;
    }

    setSubmitted(true);
    onSubmit?.({ ...values });
  };

  return (
    <Paper elevation={0} className={classes.card}>
      <form noValidate onSubmit={handleSubmit}>
        <Typography variant="h6" className={classes.cardTitle}>
          Sign In
        </Typography>

        <TextField
          className={classes.textField}
          label="Email"
          name="email"
          type="email"
          placeholder="Email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={Boolean(touched.email && errors.email)}
          helperText={touched.email && errors.email ? errors.email : '\u00A0'}
          fullWidth
          autoComplete="email"
          InputLabelProps={{ shrink: Boolean(values.email) }}
        />

        <TextField
          className={classes.textField}
          label="Password"
          name="password"
          type="password"
          placeholder="Password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={Boolean(touched.password && errors.password)}
          helperText={
            touched.password && errors.password ? errors.password : '\u00A0'
          }
          fullWidth
          autoComplete="current-password"
          InputLabelProps={{ shrink: Boolean(values.password) }}
        />

        <Button
          className={classes.submitButton}
          variant="contained"
          fullWidth
          type="submit"
          disableElevation
          disableRipple
        >
          Login
        </Button>
      </form>

      <Typography className={classes.helper}>
        <Link
          href="#"
          underline="none"
          sx={{ fontWeight: 600, color: '#1F3BAF' }}
          onClick={(event) => event.preventDefault()}
        >
          Forgot password?
        </Link>{' '}
        · Need an account?{' '}
        <Link
          href="#"
          underline="none"
          sx={{ fontWeight: 600, color: '#1F3BAF' }}
          onClick={(event) => event.preventDefault()}
        >
          Contact support
        </Link>
      </Typography>

      {submitted && !hasErrors && (
        <Typography role="status" className={classes.successBadge}>
          Demo only — authentication will connect to the API in a later sprint.
        </Typography>
      )}
    </Paper>
  );
};

export default SignInCard;
