export type FormFieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    multiline?: boolean;
    rows?: number;
    error?: boolean;
    helperText?: string;
    maxLength?: number;
};