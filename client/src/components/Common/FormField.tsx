import { TextField, Grid } from '@mui/material';
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
}) => {
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
            />
        </Grid>
    );
};

export default FormField;
