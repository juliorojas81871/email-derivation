'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormSchema } from "@/lib/schemas/schemas";
import styles from './EmailForm.module.css';

interface EmailFormProps {
  onSubmit: (data: FormSchema) => void;
  loading?: boolean;
}

export default function EmailForm({ onSubmit, loading = false }: EmailFormProps) {
  const {
    register,
    formState: { errors, isDirty, isValid, isSubmitting },
    reset,
    handleSubmit
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: "",
      firstName: "",
      lastName: ""
    },
    mode: "onTouched"
  });

  const handleFormSubmit = async (data: FormSchema) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
      <label className={styles.field}>
        <div className={styles.label}>First Name</div>
        <input
          id="firstName"
          aria-label="First Name"
          placeholder="e.g. Jane"
          {...register("firstName")}
          className={styles.input}
          type="text"
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === ' ') {
              e.preventDefault();
            }
          }}
        />
        {errors.firstName && (
          <label className={styles.errorLabel} htmlFor="firstName">
            {errors.firstName.message}
          </label>
        )}
      </label>

      <label className={styles.field}>
        <div className={styles.label}>Last Name</div>
        <input
          id="lastName"
          aria-label="Last Name"
          placeholder="e.g. Doe"
          {...register("lastName")}
          className={styles.input}
          type="text"
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === ' ') {
              e.preventDefault();
            }
          }}
        />
        {errors.lastName && (
          <label className={styles.errorLabel} htmlFor="lastName">
            {errors.lastName.message}
          </label>
        )}
      </label>

      <label className={styles.field}>
        <div className={styles.label}>Company Domain</div>
        <input
          id="domain"
          aria-label="Company Domain"
          placeholder="e.g. babbel.com or https://www.google.com"
          {...register("domain")}
          className={styles.input}
          type="text"
          disabled={loading}
        />
        {errors.domain && (
          <label className={styles.errorLabel} htmlFor="domain">
            {errors.domain.message}
          </label>
        )}
      </label>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          disabled={!isDirty || isSubmitting || loading}
          onClick={() => reset()}
          className={`${styles.button} ${styles.buttonSecondary}`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isDirty || !isValid || isSubmitting || loading}
          className={styles.button}
          aria-label={loading ? 'Deriving...' : 'Derive Email'}
        >
          {loading ? 'Deriving...' : 'Derive Email'}
        </button>
      </div>
    </form>
  );
}