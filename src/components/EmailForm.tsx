'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, FormSchema } from "@/lib/schemas";

interface EmailFormProps {
  onSubmit: (data: FormSchema) => void;
}

export default function EmailForm({ onSubmit }: EmailFormProps) {
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="form">
      <label className="field">
        <div className="label">First Name</div>
        <input
          id="firstName"
          aria-label="First Name"
          placeholder="e.g. Jane"
          {...register("firstName")}
          className="input"
          type="text"
          onKeyDown={(e) => {
            if (e.key === ' ') {
              e.preventDefault();
            }
          }}
        />
        {errors.firstName && (
          <label className="error-label" htmlFor="firstName">
            {errors.firstName.message}
          </label>
        )}
      </label>

      <label className="field">
        <div className="label">Last Name</div>
        <input
          id="lastName"
          aria-label="Last Name"
          placeholder="e.g. Doe"
          {...register("lastName")}
          className="input"
          type="text"
          onKeyDown={(e) => {
            if (e.key === ' ') {
              e.preventDefault();
            }
          }}
        />
        {errors.lastName && (
          <label className="error-label" htmlFor="lastName">
            {errors.lastName.message}
          </label>
        )}
      </label>

      <label className="field">
        <div className="label">Company Domain</div>
        <input
          id="domain"
          aria-label="Company Domain"
          placeholder="e.g. babbel.com or https://www.google.com"
          {...register("domain")}
          className="input"
          type="text"
        />
        {errors.domain && (
          <label className="error-label" htmlFor="domain">
            {errors.domain.message}
          </label>
        )}
      </label>

      <div className="button-group">
        <button
          type="button"
          disabled={!isDirty || isSubmitting}
          onClick={() => reset()}
          className="button button-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isDirty || !isValid || isSubmitting}
          className="button"
        >
          {isSubmitting ? 'Deriving...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}