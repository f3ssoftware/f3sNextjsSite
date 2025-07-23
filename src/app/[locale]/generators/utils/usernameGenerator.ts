export const ADJECTIVES = [
  "Swift", "Silent", "Brave", "Clever", "Lucky", "Mighty", "Nimble", "Fierce", "Jolly", "Wise"
];
export const NOUNS = [
  "Tiger", "Falcon", "Lion", "Wolf", "Eagle", "Shark", "Panther", "Bear", "Fox", "Hawk"
];

export function generateUsername(includeNumber: boolean = true): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  let username = `${adj}${noun}`;
  if (includeNumber) {
    username += Math.floor(10 + Math.random() * 90); // 2-digit number
  }
  return username;
} 