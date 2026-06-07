// Lightweight in-memory store that holds onboarding form data across screens.
// Cleared on app restart. Never persisted to disk.
export const onboardingStore: {
  email: string;
  password: string;
  displayName: string;
} = {
  email: '',
  password: '',
  displayName: '',
};
