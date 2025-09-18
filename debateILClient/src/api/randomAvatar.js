// Utility to fetch a random avatar image from randomuser.me API

export async function getRandomAvatarUrl() {
  try {
    const response = await fetch("https://randomuser.me/api/");
    const data = await response.json();
    return data.results[0].picture.medium;
  } catch {
    // fallback image if API fails
    return "https://randomuser.me/api/portraits/lego/1.jpg";
  }
}

export function getAvatarById(userId) {
  const lastTwoDigits = userId % 100;
  const gender = lastTwoDigits % 2 === 0 ? "women" : "men";
  return `https://randomuser.me/api/portraits/${gender}/${lastTwoDigits}.jpg`;
}

// Example usage:
// const avatarUrl = await getRandomAvatarUrl();
