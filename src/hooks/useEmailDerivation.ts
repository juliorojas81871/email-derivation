import { useState } from 'react';
import { FormSchema } from '@/lib/schemas/schemas';

interface EmailDerivationResult {
  derivedEmail: string | null;
  message: string;
}

// Encapsulates the async email derivation flow with loading, success, and error state.
export function useEmailDerivation() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const derive = async (data: FormSchema) => {
    // Reset state for a fresh attempt.
    setError(null);
    setResult(null);

    // Call API and reflect progress for UX feedback.
    setLoading(true);
    try {
      const response = await fetch('/api/derive-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          domain: data.domain,
        }),
      });

      const responseData: EmailDerivationResult = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Something went wrong');
      }

      if (responseData.derivedEmail) {
        setResult(responseData.derivedEmail);
      } else {
        setError(responseData.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    result,
    error,
    loading,
    derive
  };
}
