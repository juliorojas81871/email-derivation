import { loadSampleData } from '../data/dataLoader';
import { detectEmailPattern } from './emailPatternDetector';
import { deriveEmail } from './emailDeriver';

// High-level workflow: find sample emails for the domain → detect a name pattern → derive target email
export const deriveEmailAddress = (firstName: string, lastName: string, domain: string) => {
  const sampleData = loadSampleData();
  const fullName = `${firstName} ${lastName}`.trim();

  const domainSamples = Object.entries(sampleData)
    .filter(([, email]) => email.toLowerCase().includes(`@${domain.toLowerCase()}`));

  if (domainSamples.length === 0) {
    return {
      success: false,
      derivedEmail: null,
      message: 'Derivation not possible - no sample data found for this domain'
    };
  }

  // Stop at the first detected pattern to keep logic deterministic
  let detectedPattern: string | null = null;
  for (const [sampleName, sampleEmail] of domainSamples) {
    const pattern = detectEmailPattern(sampleName, sampleEmail);
    if (pattern) {
      detectedPattern = pattern;
      break;
    }
  }

  if (!detectedPattern) {
    return {
      success: false,
      derivedEmail: null,
      message: 'Derivation not possible - could not detect pattern from samples'
    };
  }

  // Use the detected pattern to derive the requested email
  const derivedEmail = deriveEmail(fullName, domain, detectedPattern);

  return {
    success: true,
    derivedEmail,
    message: 'Email derived successfully'
  };
};
