import { cookies } from "next/headers";

const WP_ME_URL = "https://healthacademy.ca/wp-json/wp/v2/users/me";

export async function getCurrentUser() {
  try {
    const token = (await cookies()).get("hc_token")?.value;
    // console.log("Retrieved token:", token);

    if (!token) return null;

    const res = await fetch(WP_ME_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.log("Token invalid or expired");
      return null;
    }

    const user = await res.json();
    // console.log("Current User:", user);

    return {
      id: user.id,
      username: user.name,
      email: user.email,
      roles: user.roles,
      courses_link: user._links.courses[0].href,
    };
  } catch (err: any) {
    console.log("getCurrentUser error:", err.message);
    return null;
  }
}
