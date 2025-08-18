import { FormFieldProps } from '@/app/lib/interface';
import { useCallback, useEffect, useRef, useState } from 'react';
import BlogEditor from './BlogEditor';
import { OutputData } from '@editorjs/editorjs';
import { Controller, FieldValues, UseFormRegister } from 'react-hook-form';

export interface FormFieldPropsWithChange extends FormFieldProps {
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  editorContent?: (data: OutputData | null) => void;
  initialValue?: string | number;
}


// Accordion Select Component
interface AccordionSelectProps {
  name: string;
  register: UseFormRegister<FieldValues>;
  groupedOptions: Record<string, { label: string; value: string | number; country?: string }[]> | undefined;
  baseInputClasses: string;
  errorClasses: string;
  disabled: boolean;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  initialValue?: string | number;
}

function AccordionSelect({
  name,
  register,
  groupedOptions,
  baseInputClasses,
  errorClasses,
  disabled,
  required,
  onChange,
  label,
  initialValue,
}: AccordionSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    // Auto-expand important groups by default
    const initialExpanded: Record<string, boolean> = {};
    if (groupedOptions) {
      Object.keys(groupedOptions).forEach(country => {
        if (['International', 'UEFA', 'England', 'Spain', 'Germany', 'Italy', 'France'].includes(country)) {
          initialExpanded[country] = true;
        }
      });
    }
    return initialExpanded;
  });
  const [inputValue, setInputValue] = useState(() => {
    if (initialValue) {
      console.log(`AccordionSelect ${name} - Initial value:`, initialValue);
      // Check if initial value matches an option label
      if (groupedOptions) {
        for (const [_country, options] of Object.entries(groupedOptions)) {
          const foundOption = options?.find(option => String(option.value) === String(initialValue));
          if (foundOption) {
            return foundOption.label;
          }
        }
      }
      return String(initialValue);
    }
    return '';
  });
  const [selectedValue, setSelectedValue] = useState(() => {
    if (initialValue) {
      return String(initialValue);
    }
    return '';
  });
  const [filteredOptions, setFilteredOptions] = useState(groupedOptions);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync selectedValue with the registered input
  useEffect(() => {
    if (selectedValue) {
      const hiddenInput = document.querySelector(`input[name="${name}"][type="hidden"]`) as HTMLInputElement;
      if (hiddenInput) {
        hiddenInput.value = selectedValue;
        // Trigger change event to notify react-hook-form
        const event = new Event('input', { bubbles: true });
        hiddenInput.dispatchEvent(event);
      }
    }
  }, [selectedValue, name]);

  // Filter options based on input value
  useEffect(() => {
    if (!groupedOptions) {
      setFilteredOptions({});
      return;
    }

    if (!inputValue.trim()) {
      setFilteredOptions(groupedOptions);
      return;
    }

    const filtered: typeof groupedOptions = {};
    const searchTerm = inputValue.toLowerCase().trim();

    Object.entries(groupedOptions).forEach(([country, options]) => {
      const matchingOptions = options?.filter(option =>
        option.label.toLowerCase().includes(searchTerm)
      );
      
      if (matchingOptions && matchingOptions.length > 0) {
        filtered[country] = matchingOptions;
      }
    });

    setFilteredOptions(filtered);
  }, [inputValue, groupedOptions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleGroup = (country: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [country]: !prev[country]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setSelectedValue(value);
    setIsOpen(true);

    // Trigger the onChange event for form registration
    if (onChange) {
      const event = {
        target: { value, name }
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(event);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const selectOption = (value: string | number, label: string) => {
    const stringValue = String(value);
    setSelectedValue(stringValue);
    setInputValue(label);
    setIsOpen(false);

    // Focus back to input after selection
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    // Trigger the onChange event for form registration
    if (onChange) {
      const event = {
        target: { value: stringValue, name }
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(event);
    }
  };

  const sortedGroups = filteredOptions ? Object.entries(filteredOptions) : [];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Hidden input for form registration */}
      <input
        {...register(name, { required })}
        type="hidden"
        value={selectedValue}
      />

      {/* Input field that acts as both input and dropdown trigger */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
          disabled={disabled}
          placeholder={`Type or select ${label.toLowerCase()}...`}
          className={`${baseInputClasses} ${errorClasses} px-4 py-2 pr-10`}
        />
        
        {/* Dropdown toggle button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Dropdown content */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto">
          {sortedGroups.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              {inputValue ? `No matches found for "${inputValue}"` : 'No options available'}
            </div>
          ) : (
            sortedGroups.map(([country, countryOptions]) => (
              <div key={country} className="border-b border-gray-100 last:border-b-0">
                {/* Country header */}
                <button
                  type="button"
                  onClick={() => toggleGroup(country)}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 flex items-center justify-between"
                >
                  <span>{country} ({countryOptions.length})</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedGroups[country] ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Country options */}
                {expandedGroups[country] && (
                  <div className="bg-white">
                    {countryOptions?.sort((a, b) => a.label.localeCompare(b.label)).map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => selectOption(option.value, option.label)}
                        className={`w-full px-6 py-2 text-left text-sm hover:bg-green-50 hover:text-green-600 ${selectedValue === option.value ? 'bg-green-100 text-green-600' : 'text-gray-700'
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}


export default function FormField({
  type,
  name,
  label,
  register,
  hidden,
  error,
  required,
  options,
  placeholder,
  disabled = false,
  className = '',
  onChange,
  editorContent: _editorContent,
  control,
  initialValue,
}: FormFieldPropsWithChange) {
  const getErrorMessage = useCallback((fieldName: string) => {
    const fieldError = error?.[fieldName];
    if (fieldError) {
      return fieldError.message as string;
    }
    return '';
  }, [error]);

  const baseInputClasses = `mt-1 block w-full rounded-lg border border-neutral-300 focus:border-green-500 focus:ring-green-500 ${className} outline-none transition-colors focus:ring-1`;
  const errorClasses = error?.[name] ? 'border-red-500' : '';

  const renderField = () => {
    switch (type) {
      case 'select':
        return (
          <select
            {...register(name)}
            className={`${baseInputClasses} ${errorClasses} px-4 py-2`}
            disabled={disabled}
            required={required}
            onChange={onChange}>
            <option value="">Select {label}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'grouped-select':
        // Group options by country
        const groupedOptions = options?.reduce((acc, option) => {
          // Check if option has a country property (for leagues)
          if ('country' in option && option.country) {
            const country = option.country as string;
            if (!acc[country]) {
              acc[country] = [];
            }
            acc[country].push(option);
          } else {
            // Handle ungrouped options
            if (!acc['Other']) {
              acc['Other'] = [];
            }
            acc['Other'].push(option);
          }
          return acc;
        }, {} as Record<string, typeof options>);

        return <AccordionSelect
          name={name}
          register={register}
          groupedOptions={groupedOptions}
          baseInputClasses={baseInputClasses}
          errorClasses={errorClasses}
          disabled={disabled}
          required={required}
          onChange={onChange}
          label={label}
          initialValue={initialValue}
        />;



      case 'textarea':
        return (
          <textarea
            {...register(name)}
            placeholder={placeholder}
            className={`${baseInputClasses} ${errorClasses} px-4 py-2`}
            rows={8}
            disabled={disabled}
            required={required}
          />
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            {...register(name)}
            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 accent-green-600"
            disabled={disabled}
            required={required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            step="any"
            {...register(name)}
            className={`${baseInputClasses} ${errorClasses}  px-4 py-2`}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
          />
        );
      case 'datetime-local':
        return (
          <input
            type="datetime-local"
            {...register(name)}
            className={`${baseInputClasses} ${errorClasses}  px-4 py-2`}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
          />
        );
      case 'editor':
        return control ? (
          <Controller
            name={name}
            control={control}
            defaultValue={null}
            render={({ field: { onChange, value } }) => (
              <BlogEditor onChange={onChange} blockvalue={value} />
            )}
          />
        ) : null;

      default:
        return (
          <input
            type={type}
            {...register(name)}
            placeholder={placeholder}
            className={`${baseInputClasses} ${errorClasses}  px-4 py-2`}
            disabled={disabled}
            required={required}
          />
        );
    }
  };

  return (
    <div className="flex w-full space-y-1">
      <div className="w-full">
        <label className={`block text-sm font-medium text-gray-700 ${hidden && "hidden"}`}>
          {label}
          {required && <span className={`text-red-500 ml-1`}>*</span>}
        </label>
        {renderField()}
        {error?.[name] && (
          <p className="text-red-500 text-xs mt-1">
            {getErrorMessage(name)}
          </p>
        )}
      </div>
    </div>
  );
}
