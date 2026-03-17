import * as React from 'react';
import { Controller, FormProvider, useFormContext } from 'react-hook-form';
import { cn } from '../../lib/utils';

const Form = FormProvider;

const FormFieldContext = React.createContext({});
const FormItemContext = React.createContext({});

const FormField = ({ ...props }) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext.name) {
    throw new Error('useFormField must be used within <FormField>.');
  }

  return {
    id: itemContext.id,
    name: fieldContext.name,
    formItemId: itemContext.id,
    formDescriptionId: `${itemContext.id}-description`,
    formMessageId: `${itemContext.id}-message`,
    ...fieldState,
  };
};

const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  );
});

const FormLabel = React.forwardRef(({ className, htmlFor, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <label
      ref={ref}
      htmlFor={htmlFor ?? formItemId}
      className={cn('text-sm font-medium text-slate-700 dark:text-slate-300', error && 'text-red-600 dark:text-red-400', className)}
      {...props}
    />
  );
});

const FormControl = ({ ...props }) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  if (!React.isValidElement(props.children)) {
    return null;
  }

  return React.cloneElement(props.children, {
    id: props.children.props.id ?? formItemId,
    'aria-describedby': [props.children.props['aria-describedby'], error ? formMessageId : null, props.children.props['data-has-description'] ? formDescriptionId : null]
      .filter(Boolean)
      .join(' ') || undefined,
    'aria-invalid': Boolean(error),
  });
};

const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-sm text-slate-500 dark:text-slate-400', className)}
      {...props}
    />
  );
});

const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message ?? '') : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-sm font-medium text-red-600 dark:text-red-400', className)}
      {...props}
    >
      {body}
    </p>
  );
});

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
};
