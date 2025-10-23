'use client';

import EmailForm from '@/components/EmailFrom/EmailForm';
import { ResultDisplay } from '@/components/ResultDisplay/ResultDisplay';
import { useEmailDerivation } from '@/hooks/useEmailDerivation';
import styles from './page.module.css';

export default function Home() {
  const { result, error, derive } = useEmailDerivation();

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <h1 className={styles.title}>Email Derivation</h1>
        {/* Pass the derive action into the form; the hook manages state transitions. */}
        <EmailForm onSubmit={derive} />
        {/* Combined result display handles both success and error states */}
        <ResultDisplay email={result} error={error} />
      </div>
      
      <div className={styles.sampleSection}>
        <h2 className={styles.sampleTitle}>Sample Data Patterns</h2>
        <div className={styles.sampleContent}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Available Domains:</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• babbel.com</li>
                <li>• linkedin.com</li>
                <li>• google.com</li>
                <li>• amazon.com</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Pattern Examples:</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• jdoe@babbel.com (first initial + last name)</li>
                <li>• jayarun@linkedin.com (first + last name)</li>
                <li>• steindavid@google.com (last + first name)</li>
                <li>• smithk@amazon.com (last name + first initial)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}