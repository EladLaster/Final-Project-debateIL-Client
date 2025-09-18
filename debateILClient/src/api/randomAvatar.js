// Simple avatar system - just get random avatar and cache it

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

// Get avatar for user - cache it in localStorage
export async function getAvatarForUser(userId) {
  const cacheKey = `avatar_${userId}`;
  const cachedAvatar = localStorage.getItem(cacheKey);

  if (cachedAvatar) {
    return cachedAvatar;
  }

  // Get new avatar and cache it
  const avatarUrl = await getRandomAvatarUrl();
  localStorage.setItem(cacheKey, avatarUrl);
  return avatarUrl;
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
