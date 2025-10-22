// Build an email from a full name and domain using a given naming pattern
export const deriveEmail = (fullName: string, domain: string, pattern: string): string | null => {
  const nameParts = fullName.toLowerCase().split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  const normalizedDomain = domain.toLowerCase();

  switch (pattern) {
    case 'first_name_last_name':
      return `${firstName}${lastName}@${normalizedDomain}`;
    case 'first_name_initial_last_name':
      return `${firstName[0]}${lastName}@${normalizedDomain}`;
    case 'last_name_first_name':
      return `${lastName}${firstName}@${normalizedDomain}`;
    case 'last_name_first_name_initial':
      return `${lastName}${firstName[0]}@${normalizedDomain}`;
    default:
      return null;
  }
};
