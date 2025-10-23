// Infer a naming convention by comparing a full name with a known email sample
export const detectEmailPattern = (fullName: string, email: string): string | null => {
  const nameParts = fullName.toLowerCase().split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  const localPart = email.toLowerCase().split('@')[0];

  if (localPart === `${firstName}${lastName}`) {
    return 'first_name_last_name';
  }

  if (localPart === `${firstName[0]}${lastName}`) {
    return 'first_name_initial_last_name';
  }

  if (localPart === `${lastName}${firstName}`) {
    return 'last_name_first_name';
  }

  if (localPart === `${lastName}${firstName[0]}`) {
    return 'last_name_first_name_initial';
  }

  return null;
};
