import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import { useForm, Controller } from 'react-hook-form';

export type BookFormData = {
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
  status: string;
};

export interface BookFormProps {
  defaultValues?: Partial<BookFormData>;
  onSubmit: (formValues: BookFormData) => Promise<void>;
  onReset?: () => void;
  submitButtonLabel: string;
  backButtonPath?: string;
}

export default function BookForm(props: BookFormProps) {
  const {
    defaultValues,
    onSubmit,
    onReset,
    submitButtonLabel,
    backButtonPath,
  } = props;

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<BookFormData>({
    defaultValues: {
      title: '',
      author: '',
      genre: '',
      publishedYear: new Date().getFullYear(),
      status: 'Available',
      ...defaultValues,
    },
  });

  const handleFormSubmit = React.useCallback(
    async (data: BookFormData) => {
      try {
        await onSubmit(data);
      } catch (error) {
        throw error;
      }
    },
    [onSubmit],
  );

  const handleReset = React.useCallback(() => {
    reset();
    if (onReset) {
      onReset();
    }
  }, [reset, onReset]);

  const handleBack = React.useCallback(() => {
    navigate(backButtonPath ?? '/dashboard');
  }, [navigate, backButtonPath]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      autoComplete="off"
      onReset={handleReset}
      sx={{ width: '100%' }}
    >
      <FormGroup>
        <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <Controller
              name="title"
              control={control}
              rules={{
                required: 'Title is required',
                minLength: {
                  value: 2,
                  message: 'Title must be at least 2 characters long',
                },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Title"
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message ?? ' '}
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <Controller
              name="author"
              control={control}
              rules={{
                required: 'Author is required',
                minLength: {
                  value: 2,
                  message: 'Author must be at least 2 characters long',
                },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Author"
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message ?? ' '}
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <Controller
              name="genre"
              control={control}
              rules={{
                required: 'Genre is required',
                validate: (value) =>
                  [
                    'Thriller',
                    'Memoir',
                    'Self-Help',
                    'Science Fiction',
                    'Fantasy',
                    'Biography',
                    'Philosophy',
                    'History',
                    'Dystopian',
                    'Classic',
                    'Romance',
                    'Post-Apocalyptic',
                    'Horror',
                  ].includes(value) || 'Please select a valid genre from the dropdown',
              }}
              render={({ field, fieldState }) => (
                <FormControl error={!!fieldState.error} fullWidth required>
                  <InputLabel id="book-genre-label">Genre</InputLabel>
                  <Select
                    {...field}
                    labelId="book-genre-label"
                    label="Genre"
                    fullWidth
                  >
                    <MenuItem value="Thriller">Thriller</MenuItem>
                    <MenuItem value="Memoir">Memoir</MenuItem>
                    <MenuItem value="Self-Help">Self-Help</MenuItem>
                    <MenuItem value="Science Fiction">Science Fiction</MenuItem>
                    <MenuItem value="Fantasy">Fantasy</MenuItem>
                    <MenuItem value="Biography">Biography</MenuItem>
                    <MenuItem value="Philosophy">Philosophy</MenuItem>
                    <MenuItem value="History">History</MenuItem>
                    <MenuItem value="Dystopian">Dystopian</MenuItem>
                    <MenuItem value="Classic">Classic</MenuItem>
                    <MenuItem value="Romance">Romance</MenuItem>
                    <MenuItem value="Post-Apocalyptic">Post-Apocalyptic</MenuItem>
                    <MenuItem value="Horror">Horror</MenuItem>
                  </Select>
                  <FormHelperText>{fieldState.error?.message ?? ' '}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <Controller
              name="publishedYear"
              control={control}
              rules={{
                required: 'Published year is required',
                validate: (value) => {
                  const year = Number(value);
                  if (isNaN(year)) return 'Published year must be a valid number';
                  if (year < 1500) return 'Published year must be at least 1500';
                  if (year > new Date().getFullYear()) return `Published year must be at most ${new Date().getFullYear()}`;
                  return true;
                },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Published Year"
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message ?? ' '}
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <Controller
              name="status"
              control={control}
              rules={{
                required: 'Status is required',
                validate: (value) =>
                  ['Available', 'Issued'].includes(value) || 'Please select either "Available" or "Issued"',
              }}
              render={({ field, fieldState }) => (
                <FormControl error={!!fieldState.error} fullWidth required>
                  <InputLabel id="book-status-label">Status</InputLabel>
                  <Select
                    {...field}
                    labelId="book-status-label"
                    label="Status"
                    fullWidth
                  >
                    <MenuItem value="Available">Available</MenuItem>
                    <MenuItem value="Issued">Issued</MenuItem>
                  </Select>
                  <FormHelperText>{fieldState.error?.message ?? ' '}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
      </FormGroup>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="space-between"
        sx={{ mt: 3 }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            minWidth: { xs: 'auto', sm: '120px' }
          }}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            minWidth: { xs: 'auto', sm: '120px' }
          }}
        >
          {isSubmitting ? 'Submitting...' : submitButtonLabel}
        </Button>
      </Stack>
    </Box>
  );
}
