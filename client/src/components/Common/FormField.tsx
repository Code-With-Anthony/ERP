import { TextField, Grid, Typography } from '@mui/material';
import type { FormFieldProps } from '../../types/CommonTypes';

const FormField: React.FC<FormFieldProps> = ({
    label,
    value,
    onChange,
    type = 'text',
    multiline = false,
    rows = 1,
    error = false,
    helperText = '',
    maxLength,
}) => {
    const showCharCount = !!maxLength;
    return (
        <Grid size={12}>
            <TextField
                fullWidth
                label={label}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                type={type}
                multiline={multiline}
                rows={rows}
                error={error}
                helperText={helperText}
                inputProps={maxLength ? { maxLength } : {}}
            />
            {showCharCount && (
                <Typography
                    variant="caption"
                    sx={{
                        mt: 0.5,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        color: error ? 'error.main' : 'text.secondary',
                    }}
                >
                    {`${value.length} / ${maxLength}`}
                </Typography>
            )}
        </Grid>
    );
};

export default FormField;
