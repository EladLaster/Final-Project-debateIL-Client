// Enhanced avatar system with gender support

export async function getRandomAvatarUrl(gender = "male") {
  try {
    // Use gender parameter to get appropriate avatar
    const genderParam = gender === "female" ? "female" : "male";
    const response = await fetch(`https://randomuser.me/api/?gender=${genderParam}`);
    const data = await response.json();
    return data.results[0].picture.medium;
  } catch {
    // fallback image if API fails - use gender-appropriate fallback
    const fallbackId = Math.floor(Math.random() * 100) + 1;
    const fallbackGender = gender === "female" ? "women" : "men";
    return `https://randomuser.me/api/portraits/${fallbackGender}/${fallbackId}.jpg`;
  }
}

// Get avatar for user - cache it in localStorage
export async function getAvatarForUser(userId, gender = "male") {
  const cacheKey = `avatar_${userId}`;
  const cachedAvatar = localStorage.getItem(cacheKey);

  if (cachedAvatar) {
    return cachedAvatar;
  }

  // Get new avatar and cache it
  const avatarUrl = await getRandomAvatarUrl(gender);
  localStorage.setItem(cacheKey, avatarUrl);
  return avatarUrl;
}

// Generate avatar for new user registration
export async function generateAvatarForRegistration(gender = "male") {
  return await getRandomAvatarUrl(gender);
}

// Simple fallback avatar with initials
export function getInitialsAvatar(name, size = 150) {
  const initials =
    name
      ?.split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const colors = [
    "FF6B6B",
    "4ECDC4",
    "45B7D1",
    "96CEB4",
    "FFEAA7",
    "DDA0DD",
    "98D8C8",
    "F7DC6F",
    "BB8FCE",
    "85C1E9",
  ];

  const color = colors[(name?.length || 0) % colors.length];
  return `https://ui-avatars.com/api/?name=${initials}&size=${size}&background=${color}&color=fff&bold=true`;
}
