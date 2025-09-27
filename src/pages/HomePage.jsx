import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  fetchCategories,
  fetchCities,
  fetchQuickStories,
  fetchStories,
  fetchStoryDetail,
} from '../services/apiClient';
import fallbackThumbnail from './homeFallbackThumb.svg';

const CATEGORY_FALLBACK = [
  { id: 'all', label: 'All' },
  { id: 'sports', label: 'Sports' },
  { id: 'politics', label: 'Politics' },
  { id: 'tech-ai', label: 'Tech/AI' },
  { id: 'markets', label: 'Markets' },
  { id: 'science', label: 'Science' },
];

const useStyles = makeStyles((theme) => ({
  '@global': {
    '.globe-marker-tooltip': {
      padding: '10px 14px',
      background: 'rgba(15, 23, 42, 0.88)',
      color: '#F8FAFC',
      borderRadius: 14,
      fontSize: 13.5,
      lineHeight: 1.45,
      boxShadow: '0 18px 40px -24px rgba(15, 23, 42, 0.45)',
      maxWidth: 260,
      pointerEvents: 'none',
      textAlign: 'left',
      border: '1px solid rgba(148, 163, 184, 0.25)',
    },
    '.globe-marker-tooltip.has-thumb': {
      display: 'grid',
      gridTemplateColumns: '48px 1fr',
      gap: 12,
      alignItems: 'center',
    },
    '.globe-marker-tooltip strong': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: 14,
      marginBottom: 6,
      color: '#FACC15',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
    },
    '.globe-marker-tooltip .globe-tooltip-thumb': {
      width: 48,
      height: 48,
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 6px 14px -8px rgba(15, 23, 42, 0.5)',
    },
    '.globe-marker-tooltip .globe-tooltip-thumb img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    },
    '.globe-marker-tooltip .globe-tooltip-body': {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    },
    '.globe-marker-tooltip span': {
      display: 'block',
      color: '#E2E8F0',
      fontWeight: 600,
      fontSize: 16,
      letterSpacing: '-0.1px',
    },
    '.globe-marker-tooltip p': {
      margin: 0,
      marginTop: 6,
      color: '#CBD5F5',
      fontSize: 13,
      letterSpacing: '0.01em',
    },
  },
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'radial-gradient(circle at top, #EEF2FF 0%, #F5F7FB 38%, #E2E8F0 100%)',
    padding: theme.spacing(4, 0, 6),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3, 0, 5),
    },
    [theme.breakpoints.down(420)]: {
      padding: theme.spacing(2.5, 0, 4),
    },
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    maxWidth: 960,
    width: '100%',
    margin: '0 auto',
    padding: theme.spacing(4, 6, 6),
    backgroundColor: 'rgba(255, 255, 255, 0.82)',
    backdropFilter: 'blur(8px)',
    borderRadius: 32,
    boxShadow:
      '0 40px 90px -45px rgba(15, 23, 42, 0.28), 0 20px 40px -30px rgba(30, 58, 138, 0.16)',
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(4, 3, 5),
      borderRadius: 24,
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3, 2.5, 4),
      boxShadow: '0 24px 50px -35px rgba(15, 23, 42, 0.32)',
    },
    [theme.breakpoints.down(420)]: {
      padding: theme.spacing(2.4, 1.8, 3.5),
      borderRadius: 18,
      margin: theme.spacing(0, 1.5),
      boxShadow: '0 20px 40px -32px rgba(15, 23, 42, 0.28)',
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    paddingBottom: `${theme.spacing(2.5)} !important`,
    borderBottom: '1px solid rgba(148, 163, 184, 0.25)',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: theme.spacing(1.2),
      paddingBottom: `${theme.spacing(1.8)} !important`,
    },
  },
  brand: {
    fontWeight: 700,
    fontSize: '2rem',
    color: '#1E3A8A',
    letterSpacing: '-0.5px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.85rem',
    },
    [theme.breakpoints.down(420)]: {
      fontSize: '1.65rem',
    },
  },
  logoutButton: {
    padding: theme.spacing(0.9, 2.4),
    borderRadius: 12,
    textTransform: 'none',
    fontWeight: 600,
    fontSize: 14,
    backgroundColor: theme.palette.common.white,
    color: '#121826',
    border: '1px solid rgba(15, 28, 62, 0.12)',
    boxShadow: '0px 4px 8px rgba(12, 19, 34, 0.08)',
    '&:hover': {
      backgroundColor: '#F7F9FF',
    },
  },
  navRail: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.1, 1.3),
    marginTop: `${theme.spacing(2.5)} !important`,
    borderRadius: 999,
    background:
      'linear-gradient(135deg, rgba(96, 165, 250, 0.12), rgba(59, 130, 246, 0.08) 32%, rgba(14, 165, 233, 0.08))',
    border: '1px solid rgba(148, 163, 184, 0.24)',
    overflowX: 'auto',
    boxShadow: '0 18px 40px -28px rgba(59, 130, 246, 0.35)',
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(1.2),
      padding: theme.spacing(0.9, 1.2),
    },
    [theme.breakpoints.down(420)]: {
      gap: theme.spacing(1),
      padding: theme.spacing(0.7, 0.9),
      marginTop: `${theme.spacing(2)} !important`,
      borderRadius: 24,
    },
  },
  citySelectorWrapper: {
    marginTop: `${theme.spacing(4.5)} !important`,
    width: '100%',
    maxWidth: 420,
    [theme.breakpoints.down('sm')]: {
      marginTop: `${theme.spacing(3.2)} !important`,
    },
    [theme.breakpoints.down(420)]: {
      marginTop: `${theme.spacing(2.6)} !important`,
      maxWidth: '100%',
    },
  },
  citySelectorHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1.5),
    flexWrap: 'wrap',
    marginBottom: `${theme.spacing(1.4)} !important`,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: theme.spacing(1),
    },
    [theme.breakpoints.down(420)]: {
      gap: theme.spacing(0.8),
      marginBottom: `${theme.spacing(1.1)} !important`,
    },
  },
  citySelectorLabel: {
    margin: 0,
    fontWeight: 700,
    fontSize: 15,
    color: '#0F172A',
    letterSpacing: '0.3px',
  },
  citySelectorInput: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 18,
    boxShadow: '0px 26px 60px -32px rgba(15, 23, 42, 0.32)',
    '& .MuiOutlinedInput-root': {
      padding: `${theme.spacing(0.9, 1.5)} !important`,
      borderRadius: 18,
      fontSize: 15,
      '& fieldset': {
        border: '1px solid rgba(148, 163, 184, 0.35)',
        transition: 'border-color 160ms ease, box-shadow 160ms ease',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(79, 70, 229, 0.65)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#4F46E5',
        boxShadow: '0 0 0 1px rgba(79, 70, 229, 0.2)',
      },
    },
    '& .MuiInputBase-input': {
      fontWeight: 600,
      letterSpacing: '0.2px',
      padding: theme.spacing(0.5, 0),
    },
    '& .MuiInputAdornment-root': {
      marginRight: theme.spacing(1.2),
      color: '#64748B',
    },
    [theme.breakpoints.down(420)]: {
      borderRadius: 14,
      '& .MuiOutlinedInput-root': {
        borderRadius: 14,
        fontSize: 14,
      },
      '& .MuiInputBase-input': {
        fontSize: 14,
      },
    },
  },
  citySelectorOption: {
    padding: theme.spacing(1.1, 1.6),
    borderBottom: '1px solid rgba(226, 232, 240, 0.65)',
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.8),
  },
  citySelectorPaper: {
    borderRadius: 20,
    marginTop: `${theme.spacing(1.2)} !important`,
    boxShadow: '0px 42px 80px -36px rgba(30, 41, 59, 0.45)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
  },
  citySelectorListbox: {
    padding: `${theme.spacing(1.2, 0.8, 1.4)} !important`,
    display: 'grid',
    gap: theme.spacing(0.6),
  },
  cityOptionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1.5),
  },
  cityOptionTitle: {
    fontWeight: 700,
    color: '#0F172A',
    fontSize: 16,
    letterSpacing: '-0.1px',
  },
  cityOptionCategory: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.3px',
    color: '#4338CA',
    backgroundColor: '#E0E7FF',
    borderRadius: 999,
    padding: theme.spacing(0.4, 1),
    textTransform: 'uppercase',
  },
  cityOptionHeadline: {
    margin: 0,
    color: '#475569',
    fontSize: 13.5,
    lineHeight: 1.5,
  },
  navButton: {
    padding: theme.spacing(1, 2.6),
    borderRadius: 12,
    textTransform: 'none',
    fontSize: 14,
    fontWeight: 600,
    color: '#334155',
    backgroundColor: 'transparent',
    transition: 'background-color 160ms ease, color 160ms ease, box-shadow 160ms ease',
    whiteSpace: 'nowrap',
    '&:hover': {
      backgroundColor: 'rgba(148, 163, 184, 0.18)',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.9, 2.2),
      fontSize: 13,
    },
    [theme.breakpoints.down(420)]: {
      padding: theme.spacing(0.8, 1.8),
      fontSize: 12.5,
      borderRadius: 10,
    },
  },
  navButtonActive: {
    color: '#0F172A',
    backgroundColor: `${theme.palette.common.white} !important`,
    boxShadow: '0 18px 42px -30px rgba(30, 41, 59, 0.38)',
  },
  hero: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: theme.spacing(4.5),
    padding: theme.spacing(4, 0, 6),
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3.2, 0, 5),
      gap: theme.spacing(3.6),
      alignItems: 'stretch',
    },
    [theme.breakpoints.down(420)]: {
      padding: theme.spacing(2.6, 0, 4),
      gap: theme.spacing(3),
      textAlign: 'left',
    },
  },
  globeShell: {
    width: '100%',
    maxWidth: 460,
    aspectRatio: '1 / 1',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background:
      'radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.9), rgba(232, 239, 252, 0.85))',
    boxShadow:
      '0px 45px 80px -35px rgba(32, 72, 140, 0.40), 0px 30px 45px -25px rgba(28, 52, 94, 0.30)',
    overflow: 'hidden',
    position: 'relative',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    [theme.breakpoints.down('sm')]: {
      maxWidth: 360,
    },
    [theme.breakpoints.down(420)]: {
      maxWidth: '100%',
      aspectRatio: '10 / 11',
      boxShadow: '0px 32px 60px -34px rgba(28, 52, 94, 0.32)',
    },
  },
  globeCanvas: {
    width: '100%',
    height: '100%',
    cursor: 'grab',
  },
  globeLoadingOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.1), rgba(15, 23, 42, 0.16))',
    backdropFilter: 'blur(2px)',
  },
  globeCaption: {
    marginTop: `${theme.spacing(-1.5)} !important`,
    color: '#54617E',
    fontWeight: 500,
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      marginTop: `${theme.spacing(-1)} !important`,
      fontSize: 13,
    },
  },
  storyPanel: {
    marginTop: `${theme.spacing(1)} !important`,
    padding: theme.spacing(2.6, 3),
    borderRadius: 22,
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 40px 70px -40px rgba(15, 23, 42, 0.45)',
    textAlign: 'left',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2.2, 2.4),
      borderRadius: 20,
    },
    [theme.breakpoints.down(420)]: {
      padding: theme.spacing(1.8, 2),
      borderRadius: 16,
      boxShadow: '0px 28px 50px -38px rgba(15, 23, 42, 0.38)',
    },
  },
  storyEyebrow: {
    marginBottom: `${theme.spacing(1.2)} !important`,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.4px',
    color: '#6366F1',
    textTransform: 'uppercase',
  },
  storyHeadline: {
    fontSize: 18,
    fontWeight: 600,
    color: '#111827',
    lineHeight: 1.35,
    [theme.breakpoints.down('sm')]: {
      fontSize: 17,
    },
    [theme.breakpoints.down(420)]: {
      fontSize: 16,
    },
  },
  storyMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginTop: `${theme.spacing(2)} !important`,
    color: '#475467',
    fontSize: 14,
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
      rowGap: theme.spacing(0.5),
    },
  },
  storyChip: {
    fontWeight: 600,
    backgroundColor: '#EEF2FF',
    color: '#4338CA',
  },
  srOnly: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  },
  flashButton: {
    padding: theme.spacing(1.4, 3.6),
    borderRadius: 14,
    backgroundColor: '#070C1A',
    color: theme.palette.common.white,
    textTransform: 'none',
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: '0.2px',
    boxShadow: '0px 18px 28px -18px rgba(7, 12, 26, 0.65)',
    '&:hover': {
      backgroundColor: '#0D1222',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'center',
      padding: theme.spacing(1.25, 2.4),
    },
    [theme.breakpoints.down(420)]: {
      fontSize: 15,
      borderRadius: 12,
    },
  },
  quickButtonContent: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  quickDialogHeader: {
    padding: '26px 30px 14px !important',
    [theme.breakpoints.down('sm')]: {
      padding: '20px 22px 12px !important',
    },
    [theme.breakpoints.down(420)]: {
      padding: '18px 18px 10px !important',
    },
  },
  quickDialogTitle: {
    fontWeight: 700,
    fontSize: 22,
    color: '#0F172A',
    letterSpacing: '-0.3px',
    marginBottom: '6px !important',
    [theme.breakpoints.down('sm')]: {
      fontSize: 20,
    },
    [theme.breakpoints.down(420)]: {
      fontSize: 18,
    },
  },
  quickDialogSubtitle: {
    color: '#64748B',
    fontSize: 14,
    [theme.breakpoints.down('sm')]: {
      fontSize: 13,
    },
    [theme.breakpoints.down(420)]: {
      fontSize: 12.5,
    },
  },
  quickDialogContent: {
    padding: '20px 32px 32px !important',
    background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.96) 0%, #FFFFFF 70%)',
    maxHeight: 540,
    [theme.breakpoints.down('sm')]: {
      padding: '18px 22px 26px !important',
    },
    [theme.breakpoints.down(420)]: {
      padding: '16px 18px 24px !important',
    },
  },
  quickList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.6),
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(1.3),
    },
    [theme.breakpoints.down(420)]: {
      gap: theme.spacing(1.1),
    },
  },
  quickListItem: {
    padding: theme.spacing(1.6, 2),
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    boxShadow: '0 26px 50px -34px rgba(15, 23, 42, 0.38)',
    textAlign: 'left',
    display: 'flex',
    gap: theme.spacing(1.8),
    alignItems: 'stretch',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      gap: theme.spacing(1.2),
      padding: theme.spacing(1.4, 1.6),
    },
    [theme.breakpoints.down(420)]: {
      borderRadius: 16,
      padding: theme.spacing(1.2, 1.4),
      boxShadow: '0 20px 40px -32px rgba(15, 23, 42, 0.32)',
    },
  },
  quickListContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.2),
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(1),
    },
  },
  quickListHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1.4),
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(1.1),
    },
    [theme.breakpoints.down(420)]: {
      alignItems: 'center',
      gap: theme.spacing(0.9),
    },
  },
  quickThumbnail: {
    width: 72,
    height: 72,
    borderRadius: 16,
    objectFit: 'cover',
    flexShrink: 0,
    boxShadow: '0 18px 36px -26px rgba(15, 23, 42, 0.6)',
    backgroundColor: '#E2E8F0',
    display: 'block',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: 160,
      borderRadius: 14,
    },
    [theme.breakpoints.down(420)]: {
      height: 140,
    },
  },
  quickIndex: {
    minWidth: 34,
    height: 34,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    color: '#F97316',
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: '0.2px',
    [theme.breakpoints.down('sm')]: {
      minWidth: 30,
      height: 30,
      fontSize: 13,
    },
    [theme.breakpoints.down(420)]: {
      minWidth: 28,
      height: 28,
      fontSize: 12.5,
    },
  },
  quickHeadline: {
    fontWeight: 700,
    fontSize: 16,
    color: '#111827',
    lineHeight: 1.35,
    [theme.breakpoints.down('sm')]: {
      fontSize: 15,
    },
    [theme.breakpoints.down(420)]: {
      fontSize: 14.5,
    },
  },
  quickMeta: {
    marginTop: `${theme.spacing(0.6)} !important`,
    color: '#64748B',
    fontSize: 13,
    fontWeight: 600,
    [theme.breakpoints.down('sm')]: {
      fontSize: 12.5,
    },
  },
  quickDescription: {
    marginTop: `${theme.spacing(0.8)} !important`,
    color: '#475569',
    fontSize: 13.5,
    lineHeight: 1.5,
    [theme.breakpoints.down('sm')]: {
      fontSize: 13,
    },
    [theme.breakpoints.down(420)]: {
      fontSize: 12.8,
    },
  },
  quickDialogActions: {
    padding: '18px 28px 22px !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: '16px 22px 20px !important',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      gap: theme.spacing(1.2),
    },
    [theme.breakpoints.down(420)]: {
      padding: '14px 18px 18px !important',
    },
  },
  quickDialogInfo: {
    color: '#64748B',
    fontSize: 13,
    [theme.breakpoints.down('sm')]: {
      fontSize: 12.5,
      lineHeight: 1.4,
      textAlign: 'left',
    },
  },
  quickLoadingWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220,
    [theme.breakpoints.down('sm')]: {
      minHeight: 200,
    },
    [theme.breakpoints.down(420)]: {
      minHeight: 180,
    },
  },
  quickErrorText: {
    color: '#DC2626',
    fontWeight: 600,
    textAlign: 'center',
  },
  quickEmptyText: {
    color: '#475569',
    fontWeight: 600,
    textAlign: 'center',
  },
  dialogHeadline: {
    fontWeight: 700,
    fontSize: 20,
    color: '#0F172A',
    letterSpacing: '-0.2px',
    [theme.breakpoints.down('sm')]: {
      fontSize: 18.5,
    },
    [theme.breakpoints.down(420)]: {
      fontSize: 17,
    },
  },
  dialogSubtext: {
    marginTop: `${theme.spacing(1)} !important`,
    color: '#475569',
    lineHeight: 1.5,
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
    },
    [theme.breakpoints.down(420)]: {
      fontSize: 13.5,
    },
  },
  dialogBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(1.6),
    },
  },
  dialogThumbnail: {
    width: '100%',
    maxHeight: 220,
    borderRadius: 16,
    objectFit: 'cover',
    boxShadow: '0 24px 48px -28px rgba(15, 23, 42, 0.4)',
    backgroundColor: '#E2E8F0',
    [theme.breakpoints.down('sm')]: {
      maxHeight: 200,
      borderRadius: 14,
    },
    [theme.breakpoints.down(420)]: {
      maxHeight: 180,
    },
  },
  dialogCityTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.8),
    fontSize: 13,
    fontWeight: 600,
    color: '#6366F1',
    backgroundColor: '#EEF2FF',
    borderRadius: 999,
    padding: theme.spacing(0.6, 1.2),
    marginBottom: `${theme.spacing(1.5)} !important`,
    [theme.breakpoints.down('sm')]: {
      fontSize: 12.5,
      padding: theme.spacing(0.5, 1),
    },
    [theme.breakpoints.down(420)]: {
      fontSize: 12,
    },
  },
}));

const DEFAULT_POINT_OF_VIEW = { lat: 22, lng: 15, altitude: 2.2 };
const PRIMARY_MARKER_COLOR = '#F97316';
const FALLBACK_THUMBNAIL = fallbackThumbnail;

const escapeTooltipText = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const escapeAttribute = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const resolveThumbnailUrl = (item) => {
  if (!item) {
    return FALLBACK_THUMBNAIL;
  }

  const candidate =
    item.thumbnailUrl ?? item.thumbnail ?? item.imageUrl ?? item.image_url ?? '';

  if (typeof candidate === 'string') {
    const trimmed = candidate.trim();
    return trimmed ? trimmed : FALLBACK_THUMBNAIL;
  }

  return FALLBACK_THUMBNAIL;
};

const buildTooltipMarkup = (marker) => {
  const safeCity = escapeTooltipText(marker.city);
  const safeHeadline = escapeTooltipText(marker.headline);
  const thumbnailUrl = resolveThumbnailUrl(marker);
  const usingFallback = thumbnailUrl === FALLBACK_THUMBNAIL;
  const altText = usingFallback
    ? 'Default news thumbnail'
    : `Thumbnail for ${safeCity}`;
  const thumbnailMarkup = `<div class="globe-tooltip-thumb"><img src="${escapeAttribute(
    thumbnailUrl
  )}" alt="${escapeAttribute(altText)}" loading="lazy" /></div>`;
  const safeDescription = marker.description
    ? `<p>${escapeTooltipText(marker.description)}</p>`
    : '';
  const rootClass = 'globe-marker-tooltip has-thumb';

  return `<div class="${rootClass}">${thumbnailMarkup}<div class="globe-tooltip-body"><strong>📍 ${safeCity}</strong><span>${safeHeadline}</span>${safeDescription}</div></div>`;
};

const HomePage = () => {
  const classes = useStyles();
  const [categories, setCategories] = useState(CATEGORY_FALLBACK);
  const [activeCategory, setActiveCategory] = useState(CATEGORY_FALLBACK[0].id);
  const [stories, setStories] = useState([]);
  const [storiesCursor, setStoriesCursor] = useState(null);
  const [isFetchingMoreStories, setIsFetchingMoreStories] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedCategory, setHighlightedCategory] = useState(CATEGORY_FALLBACK[0].id);
  const [selectedStory, setSelectedStory] = useState(null);
  const [modalStory, setModalStory] = useState(null);
  const [isQuickDialogOpen, setIsQuickDialogOpen] = useState(false);
  const [quickHeadlines, setQuickHeadlines] = useState([]);
  const [isQuickLoading, setIsQuickLoading] = useState(false);
  const [quickError, setQuickError] = useState(null);
  const [quickDialogCategoryLabel, setQuickDialogCategoryLabel] = useState(
    CATEGORY_FALLBACK[0].label
  );
  const [quickRefreshedAt, setQuickRefreshedAt] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const [cityError, setCityError] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const globeRef = useRef(null);

  const getCategoryLabel = useCallback(
    (id) => categories.find((category) => category.id === id)?.label ?? id,
    [categories]
  );

  useEffect(() => {
    let isMounted = true;

    fetchCategories()
      .then((response) => {
        if (!isMounted) {
          return;
        }

        const apiCategories = response?.categories ?? [];

        if (!apiCategories.length) {
          setCategories(CATEGORY_FALLBACK);
          return;
        }

        const normalized = apiCategories.map((category) => ({
          id: category.id,
          label: category.label,
        }));

        // Ensure "all" remains first and unique ordering is preserved from API.
        const uniqueMap = new Map();
        [...normalized].forEach((category) => {
          uniqueMap.set(category.id, category);
        });

        CATEGORY_FALLBACK.forEach((fallbackCategory) => {
          if (!uniqueMap.has(fallbackCategory.id)) {
            uniqueMap.set(fallbackCategory.id, fallbackCategory);
          }
        });

        const mergedCategories = Array.from(uniqueMap.values());

        setCategories(mergedCategories);

        if (!mergedCategories.some((category) => category.id === activeCategory)) {
          const nextCategory = mergedCategories[0]?.id ?? CATEGORY_FALLBACK[0].id;
          setActiveCategory(nextCategory);
          setHighlightedCategory(nextCategory);
        }
      })
      .catch(() => {
        if (isMounted) {
          setCategories(CATEGORY_FALLBACK);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []); // fetch categories once on mount

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setStoriesCursor(null);
    setStories([]);

    fetchStories({ category: activeCategory, includeDescription: true, limit: 50 })
      .then((response) => {
        if (!isMounted) {
          return;
        }

        const apiStories = response?.stories ?? [];
        setStoriesCursor(response?.nextCursor ?? null);

        setStories(
          apiStories.map((story) => ({
            ...story,
            lat: story.lat ?? story.latitude,
            lng: story.lng ?? story.longitude,
            color: PRIMARY_MARKER_COLOR,
            isPartial: false,
          }))
        );
      })
      .catch(() => {
        if (isMounted) {
          setStories([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeCategory]);

  useEffect(() => {
    let isMounted = true;
    setIsCitiesLoading(true);
    setCityError(null);

    fetchCities({ category: activeCategory })
      .then((response) => {
        if (!isMounted) {
          return;
        }

        const apiCities = response?.cities ?? [];
        setCityOptions(
          apiCities.map((city) => ({
            ...city,
            lat: city.latitude,
            lng: city.longitude,
          }))
        );
      })
      .catch(() => {
        if (isMounted) {
          setCityOptions([]);
          setCityError('Unable to load city list.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsCitiesLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeCategory]);

  useEffect(() => {
    setHighlightedCategory(activeCategory);
    setQuickDialogCategoryLabel(getCategoryLabel(activeCategory));
  }, [activeCategory, getCategoryLabel]);

  const loadQuickHeadlines = useCallback((categoryId) => {
    setIsQuickLoading(true);
    setQuickError(null);

    fetchQuickStories({ category: categoryId, limit: 10 })
      .then((response) => {
        const quickStories = response?.stories ?? [];

        setQuickHeadlines(
          quickStories.map((story) => ({
            ...story,
            lat: story.lat ?? story.latitude,
            lng: story.lng ?? story.longitude,
            color: PRIMARY_MARKER_COLOR,
          }))
        );
        const resolvedCategoryId = response.category ?? categoryId;
        setQuickDialogCategoryLabel(getCategoryLabel(resolvedCategoryId));
        setQuickRefreshedAt(new Date());
      })
      .catch(() => {
        setQuickHeadlines([]);
        setQuickError('Unable to load quick headlines. Please try again.');
      })
      .finally(() => {
        setIsQuickLoading(false);
      });
  }, [getCategoryLabel]);

  const loadMoreStories = useCallback(() => {
    if (!storiesCursor || isFetchingMoreStories) {
      return;
    }

    setIsFetchingMoreStories(true);

    fetchStories({
      category: activeCategory,
      includeDescription: true,
      limit: 50,
      since: storiesCursor,
    })
      .then((response) => {
        const additionalStories = response?.stories ?? [];
        setStoriesCursor(response?.nextCursor ?? null);

        if (!additionalStories.length) {
          return;
        }

        setStories((prevStories) => {
          const nextStories = [...prevStories];
          const seenIds = new Set(prevStories.map((story) => story.id));

          additionalStories.forEach((story) => {
            if (seenIds.has(story.id)) {
              return;
            }

            nextStories.push({
              ...story,
              lat: story.lat ?? story.latitude,
              lng: story.lng ?? story.longitude,
              color: PRIMARY_MARKER_COLOR,
              isPartial: false,
            });
          });

          return nextStories;
        });
      })
      .catch(() => {
        // silently ignore for now; could surface toast if needed
      })
      .finally(() => {
        setIsFetchingMoreStories(false);
      });
  }, [storiesCursor, isFetchingMoreStories, activeCategory]);

  useEffect(() => {
    if (!isQuickDialogOpen) {
      return;
    }

    setQuickHeadlines([]);
    setQuickRefreshedAt(null);
    loadQuickHeadlines(activeCategory);
  }, [activeCategory, isQuickDialogOpen, loadQuickHeadlines]);

  useEffect(() => {
    setModalStory(null);

    if (!stories.length) {
      setSelectedStory(null);
      return;
    }

    setSelectedStory((current) => {
      if (!current) {
        return stories[0];
      }

      const match = stories.find((story) => story.id === current.id);
      return match ?? stories[0];
    });
  }, [stories]);

  const handleGlobeReady = useCallback(() => {
    if (!globeRef.current) {
      return;
    }

    const controls = globeRef.current.controls();
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0;

    globeRef.current.pointOfView(DEFAULT_POINT_OF_VIEW);
  }, []);

  useEffect(() => {
    if (!globeRef.current || !selectedStory) {
      return;
    }

    const targetView = {
      lat: selectedStory.lat,
      lng: selectedStory.lng,
      altitude: 1.75,
    };

    const timeoutId = window.setTimeout(() => {
      globeRef.current?.pointOfView(targetView, 750);
    }, 200);

    return () => window.clearTimeout(timeoutId);
  }, [selectedStory]);

  const handleOpenQuickDialog = () => {
    setIsQuickDialogOpen(true);
    setQuickRefreshedAt(null);
    setQuickHeadlines([]);
    loadQuickHeadlines(activeCategory);
  };

  const handleCloseQuickDialog = () => {
    setIsQuickDialogOpen(false);
  };

  const autoCompleteOptions = useMemo(() => {
    const storyMap = new Map(stories.map((story) => [story.id, story]));
    const merged = [...stories];

    cityOptions.forEach((city) => {
      if (!city.storyId || storyMap.has(city.storyId)) {
        return;
      }

      merged.push({
        id: city.storyId,
        city: city.city,
        category: city.category ?? activeCategory,
        headline: 'Tap to load latest headline',
        description: '',
        lat: city.lat,
        lng: city.lng,
        color: PRIMARY_MARKER_COLOR,
        isPartial: true,
      });
    });

    return merged;
  }, [stories, cityOptions, activeCategory]);

  const handleCitySelection = useCallback((option) => {
    if (!option) {
      return;
    }

    if (!option.isPartial) {
      setSelectedStory(option);
      return;
    }

    setSelectedStory(option);
    setIsDetailLoading(true);

    fetchStoryDetail(option.id)
      .then((detail) => {
        if (!detail) {
          setSelectedStory(option);
          return;
        }

        const normalizedStory = {
          ...option,
          ...detail,
          id: detail.id ?? option.id,
          city: detail.city ?? option.city,
          category: detail.category ?? option.category,
          headline: detail.headline ?? option.headline,
          description: detail.description ?? '',
          lat: detail.latitude ?? option.lat,
          lng: detail.longitude ?? option.lng,
          color: PRIMARY_MARKER_COLOR,
          isPartial: false,
        };

        setStories((prevStories) => {
          const existingIndex = prevStories.findIndex((story) => story.id === normalizedStory.id);
          if (existingIndex >= 0) {
            const nextStories = [...prevStories];
            nextStories[existingIndex] = {
              ...nextStories[existingIndex],
              ...normalizedStory,
            };
            return nextStories;
          }

          return [...prevStories, normalizedStory];
        });

        setSelectedStory(normalizedStory);
      })
      .catch(() => {
        setSelectedStory(option);
      })
      .finally(() => {
        setIsDetailLoading(false);
      });
  }, []);

  const activeCategoryLabel = getCategoryLabel(activeCategory);
  const selectedStoryCategoryLabel = selectedStory
    ? getCategoryLabel(selectedStory.category)
    : '';
  const modalStoryThumbnail = modalStory ? resolveThumbnailUrl(modalStory) : FALLBACK_THUMBNAIL;
  const modalThumbnailIsFallback = modalStoryThumbnail === FALLBACK_THUMBNAIL;

  return (
    <Box className={classes.root}>
      <Box className={classes.container}>
        <Box>
          <Box className={classes.header}>
            <Typography variant="h5" className={classes.brand}>
              GlobePulse
            </Typography>
          </Box>
          <Box className={classes.navRail} role="tablist" aria-label="News categories">
            {categories.map((category) => {
              const isActive = highlightedCategory === category.id;

              return (
                <Button
                  key={category.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`${classes.navButton} ${isActive ? classes.navButtonActive : ''}`}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setHighlightedCategory(category.id);
                  }}
                  disableRipple
                >
                  {category.label}
                </Button>
              );
            })}
          </Box>
        </Box>

        <Box className={classes.hero}>
          <Box className={classes.citySelectorWrapper}>
            <Box className={classes.citySelectorHeader}>
              <Typography className={classes.citySelectorLabel}>Jump to a city</Typography>
              <Button
                className={classes.flashButton}
                variant="contained"
                disableElevation
                onClick={handleOpenQuickDialog}
                disabled={isQuickLoading}
              >
                {isQuickLoading ? (
                  <span className={classes.quickButtonContent}>
                    <CircularProgress size={18} sx={{ color: '#F8FAFC' }} />
                    Loading…
                  </span>
                ) : (
                  '⚡ Quick 10 Headlines'
                )}
              </Button>
            </Box>
            <Autocomplete
              fullWidth
              disableClearable
              options={autoCompleteOptions}
              value={selectedStory ?? null}
              onChange={(_, newValue) => {
                handleCitySelection(newValue);
              }}
              getOptionLabel={(option) => option.city ?? ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              loading={
                isLoading || isCitiesLoading || isDetailLoading || isFetchingMoreStories
              }
              loadingText="Loading cities..."
              noOptionsText={cityError ?? 'No live stories yet'}
              classes={{
                option: classes.citySelectorOption,
                paper: classes.citySelectorPaper,
                listbox: classes.citySelectorListbox,
              }}
              ListboxProps={{
                onScroll: (event) => {
                  const list = event.currentTarget;
                  const threshold = list.scrollHeight - list.clientHeight - 32;
                  if (list.scrollTop >= threshold) {
                    loadMoreStories();
                  }
                },
              }}
              renderOption={(props, option) => {
                const optionClassName = `${props.className ?? ''} ${classes.citySelectorOption}`.trim();
                return (
                  <li {...props} className={optionClassName}>
                    <Box className={classes.cityOptionHeader}>
                      <Typography className={classes.cityOptionTitle}>{option.city}</Typography>
                      <span className={classes.cityOptionCategory}>
                        {getCategoryLabel(option.category)}
                      </span>
                    </Box>
                    <Typography component="p" className={classes.cityOptionHeadline}>
                      {option.headline}
                    </Typography>
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={
                    autoCompleteOptions.length
                      ? 'Search or select a city…'
                      : isLoading || isCitiesLoading || isDetailLoading || isFetchingMoreStories
                        ? 'Loading cities…'
                        : 'No cities available yet'
                  }
                  className={classes.citySelectorInput}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <Box component="span" sx={{ marginRight: 1, fontSize: 18, color: '#475569' }}>
                          🔍
                        </Box>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                    endAdornment: params.InputProps.endAdornment,
                  }}
                />
              )}
            />
            {cityError && (
              <Typography variant="caption" sx={{ display: 'block', marginTop: 1, color: '#DC2626' }}>
                {cityError}
              </Typography>
            )}
          </Box>
          <Box className={classes.globeShell}>
            <span className={classes.srOnly}>Interactive globe with live news markers</span>
            <Globe
              ref={globeRef}
              data-testid="interactive-globe"
              className={classes.globeCanvas}
              globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
              bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
              backgroundColor="rgba(255,255,255,0)"
              labelsData={stories}
              labelLat={(marker) => marker.lat}
              labelLng={(marker) => marker.lng}
              labelText={(marker) => marker.city}
              labelSize={(marker) => (selectedStory?.id === marker.id ? 1.45 : 1.2)}
              labelDotRadius={(marker) => (selectedStory?.id === marker.id ? 1.18 : 0.7)}
              labelColor={() => PRIMARY_MARKER_COLOR}
              labelAltitude={() => 0.022}
              labelDotOrientation={() => 'top'}
              labelLabel={(marker) => buildTooltipMarkup(marker)}
              ringsData={selectedStory ? [selectedStory] : []}
              ringColor={(story) => (t) => `rgba(79, 70, 229, ${0.36 - t * 0.28})`}
              ringMaxRadius={() => 8}
              ringPropagationSpeed={() => 8}
              animateIn
              onGlobeReady={handleGlobeReady}
              onLabelClick={(marker) => {
                if (!marker) {
                  return;
                }

                setSelectedStory(marker);
                setModalStory(marker);
              }}
            />
            {(isLoading || isDetailLoading) && (
              <Box className={classes.globeLoadingOverlay}>
                <CircularProgress size={36} sx={{ color: '#F97316' }} />
              </Box>
            )}
          </Box>
          <Typography variant="subtitle1" className={classes.globeCaption}>
            Interactive 3D Globe with news markers
          </Typography>

          {selectedStory && (
            <Box className={classes.storyPanel} data-testid="top-story-panel">
              <Typography className={classes.storyEyebrow}>
                Spotlight ·{' '}
                {activeCategory === 'all' ? selectedStoryCategoryLabel : activeCategoryLabel}
              </Typography>
              <Typography className={classes.storyHeadline}>{selectedStory.headline}</Typography>
              <Box className={classes.storyMeta}>
                <Chip size="small" label={selectedStory.city} className={classes.storyChip} />
                <Typography component="span">{selectedStoryCategoryLabel}</Typography>
              </Box>
            </Box>
          )}

          {isLoading && (
            <Typography variant="caption" sx={{ marginTop: 2, color: '#64748B' }}>
              Updating global headlines…
            </Typography>
          )}
        </Box>
      </Box>

      <Dialog
        open={isQuickDialogOpen}
        onClose={handleCloseQuickDialog}
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: 8,
            width: '100%',
            maxWidth: 760,
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 90%)',
            boxShadow: '0 48px 90px -40px rgba(15, 23, 42, 0.55)',
            border: '1px solid rgba(226, 232, 240, 0.9)',
          },
        }}
      >
        <DialogTitle className={classes.quickDialogHeader}>
          <Typography component="h2" className={classes.quickDialogTitle}>
            Quick 10 · {quickDialogCategoryLabel}
          </Typography>
          <Typography className={classes.quickDialogSubtitle}>
            Latest headlines anchored to your current category.
          </Typography>
        </DialogTitle>
        <DialogContent dividers className={classes.quickDialogContent}>
          {isQuickLoading ? (
            <Box className={classes.quickLoadingWrap}>
              <CircularProgress size={28} sx={{ color: '#F97316' }} />
            </Box>
          ) : quickError ? (
            <Typography className={classes.quickErrorText}>{quickError}</Typography>
          ) : quickHeadlines.length ? (
            <Box className={classes.quickList}>
              {quickHeadlines.map((story, index) => {
                const thumbnailUrl = resolveThumbnailUrl(story);
                const usingFallback = thumbnailUrl === FALLBACK_THUMBNAIL;

                return (
                  <Box key={story.id} className={classes.quickListItem}>
                    {thumbnailUrl && (
                      <Box
                        component="img"
                        src={thumbnailUrl}
                        alt={usingFallback ? 'Default news thumbnail' : `${story.city} headline thumbnail`}
                        loading="lazy"
                        className={classes.quickThumbnail}
                        onError={(event) => {
                          if (event.currentTarget.dataset.fallbackApplied === 'true') {
                            return;
                          }
                          event.currentTarget.dataset.fallbackApplied = 'true';
                          event.currentTarget.src = FALLBACK_THUMBNAIL;
                        }}
                      />
                    )}
                    <Box className={classes.quickListContent}>
                      <Box className={classes.quickListHeader}>
                        <span className={classes.quickIndex}>{String(index + 1).padStart(2, '0')}</span>
                        <Typography className={classes.quickHeadline}>{story.headline}</Typography>
                      </Box>
                      <Typography className={classes.quickMeta}>
                        {story.city} · {getCategoryLabel(story.category)}
                      </Typography>
                      {story.description && (
                        <Typography className={classes.quickDescription}>{story.description}</Typography>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Typography className={classes.quickEmptyText}>
              No quick headlines available right now.
            </Typography>
          )}
        </DialogContent>
        <DialogActions className={classes.quickDialogActions}>
          <Typography className={classes.quickDialogInfo}>
            Showing up to 10 {quickDialogCategoryLabel} headlines ·
            {quickRefreshedAt
              ? ` refreshed at ${quickRefreshedAt.toLocaleTimeString()}`
              : ' refreshing…'}
          </Typography>
          <Button onClick={handleCloseQuickDialog} variant="contained" disableElevation>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(modalStory)}
        onClose={() => setModalStory(null)}
        PaperProps={{
          sx: {
            borderRadius: 8,
            padding: 2.5,
            maxWidth: 480,
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
            boxShadow: '0px 40px 90px -38px rgba(15, 23, 42, 0.55)',
            border: '1px solid rgba(226, 232, 240, 0.9)',
          },
        }}
      >
        {modalStory && (
          <>
            <DialogTitle sx={{ paddingBottom: 0 }}>
              <span className={classes.dialogCityTag}>📍 {modalStory.city}</span>
              <Typography className={classes.dialogHeadline}>{modalStory.headline}</Typography>
            </DialogTitle>
            <DialogContent sx={{ paddingTop: 2 }}>
              <Box className={classes.dialogBody}>
                {modalStoryThumbnail && (
                  <Box
                    component="img"
                    src={modalStoryThumbnail}
                    alt={modalThumbnailIsFallback ? 'Default news thumbnail' : `${modalStory.city} headline thumbnail`}
                    loading="lazy"
                    className={classes.dialogThumbnail}
                    onError={(event) => {
                      if (event.currentTarget.dataset.fallbackApplied === 'true') {
                        return;
                      }
                      event.currentTarget.dataset.fallbackApplied = 'true';
                      event.currentTarget.src = FALLBACK_THUMBNAIL;
                    }}
                  />
                )}
                {modalStory.description && (
                  <Typography variant="body1" className={classes.dialogSubtext}>
                    {modalStory.description}
                  </Typography>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{ paddingTop: 1.5, justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalStory(null)} variant="contained" disableElevation>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default HomePage;
