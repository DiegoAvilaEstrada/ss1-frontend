import { type ChangeEvent, type KeyboardEvent, useState } from "react";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface TextInputProps {
  onChange?: (values: { value: string; name: string }) => void;
  value?: string;
  validations?: any; // Define una interfaz para tus validaciones si es necesario
  errorForm?: boolean;
  helperTextForm?: string;
  maxCharacters?: number;
  name: string;
  label: string;
}

interface PasswordInputProps {
  onChange?: (values: { value: string; name: string }) => void;
  value?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  validations?: any;
  errorForm?: boolean;
  helperTextForm?: string;
  maxCharacters?: number;
  name: string;
  label: string;
}

interface SelectSimplyInputProps {
  onChange?: (values: { value: object; name: string }) => void;
  value: any;
  options: any[];
  label: string;
  labelOptions: string;
  valueOptions: string;
  variant: "outlined" | "filled" | "standard";
  validations: any;
  name: string;
  errorForm: boolean;
  helperTextForm: String;
}
interface NumberInputProps {
  value: number;
  onChange?: (values: { value: number; name: string }) => void;
  errorForm: boolean;
  name: string;
  helperTextForm: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  onChange,
  value,
  validations,
  errorForm = false,
  helperTextForm = "",
  maxCharacters,
  name,
  label,
  ...props
}) => {
  const handleValueChange = (values: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      const newValues = { value: values.target.value, name };
      onChange(newValues);
    }
  };

  return (
    <TextField
      {...props}
      value={value}
      fullWidth
      label={label}
      onChange={handleValueChange}
      error={!!errorForm || false}
      helperText={helperTextForm || ""}
      slotProps={{
        htmlInput: {
          maxLength: maxCharacters,
        },
      }}
    />
  );
};

export const PasswordInput: React.FC<PasswordInputProps> = ({
  onChange,
  value,
  validations,
  errorForm = false,
  helperTextForm = "",
  maxCharacters,
  name,
  label,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((value) => !value);

  const handleValueChange = (values: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      const newValues = { value: values.target.value, name };
      onChange(newValues);
    }
  };

  return (
    <>
      <TextField
        {...props}
        value={value}
        label={label}
        fullWidth
        onChange={handleValueChange}
        error={!!errorForm || false}
        helperText={helperTextForm || ""}
        type={showPassword ? "text" : "password"}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={togglePasswordVisibility}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </>
  );
};

export const SelectSimplyInput: React.FC<SelectSimplyInputProps> = ({
  onChange,
  value,
  options = [],
  labelOptions = "label",
  valueOptions = "value",
  variant = "outlined",
  validations,
  label,
  name,
  errorForm = false,
  helperTextForm = "",
  ...props
}) => {
  let _menuItems = [];

  const handleValueChange = (values: any) => {
    if (onChange) {
      const selectedItem = options.find(
        (option) => option[valueOptions] === values.target.value
      );
      const newValues = {
        value: {
          [labelOptions]: selectedItem ? selectedItem[labelOptions] : "",
          [valueOptions]: values.target.value,
        },
        name: name,
      };
      onChange(newValues);
    }
  };

  _menuItems = options.map((option) => ({
    [labelOptions]: option[labelOptions],
    [valueOptions]: option[valueOptions],
  }));
  const valueInput = value !== null ? value[valueOptions] ?? "" : value ?? "";

  return (
    <FormControl
      {...props}
      variant={variant || "outlined"}
      sx={{
        minWidth: 70,
      }}
      fullWidth
      error={!!errorForm || false}
    >
      <InputLabel>{label}</InputLabel>
      <Select {...props} value={valueInput} onChange={handleValueChange}>
        {options.length <= 0 && (
          <MenuItem value="">
            <em>No opciones disponibles</em>
          </MenuItem>
        )}

        {renderOptions(name, labelOptions, valueOptions, _menuItems)}
      </Select>
      <FormHelperText>{helperTextForm || ""}</FormHelperText>
    </FormControl>
  );
};

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  errorForm,
  helperTextForm,
  name,
  ...props
}) => {
  const handleValueChange = (values: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      const newValues = {
        value: Number(values.target.value),
        name: name,
      };
      onChange(newValues);
    }
  };
  return (
    <TextField
      {...props}
      value={value}
      fullWidth
      onChange={handleValueChange}
      type="number"
      variant="outlined"
      error={!!errorForm || false}
      helperText={helperTextForm || ""}
    />
  );
};

const renderOptions = (
  name: string,
  labelOptions: string,
  valueOptions: string,
  arrayOptions: any[]
) => {
  return arrayOptions.map((item) => {
    if (typeof item === "object") {
      return (
        <MenuItem
          key={`${name}-${item[valueOptions]}`}
          value={item[valueOptions]}
        >
          {item[labelOptions]}
        </MenuItem>
      );
    } else {
      return (
        <MenuItem key={`${name}-${item}`} value={item}>
          {item}
        </MenuItem>
      );
    }
  });
};
