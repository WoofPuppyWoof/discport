import { auth, currentUser, redirectToSignUp } from "@clerk/nextjs";
import { db } from "@/lib/db"
import { redirect } from "next/navigation";

export const currentProfile = async () => {
  const { userId } = auth();
  const userCurrent = await currentUser() || null;

  if (!userId) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      userId
    }
  });

  if (profile) {
    let updatedProfile = null || await db.profile.update({
      where: {
        userId: userId
      },
      data: {
        name: `${userCurrent?.firstName} ${userCurrent?.lastName}`,
        imageUrl: userCurrent?.imageUrl,
        email: userCurrent?.emailAddresses[0].emailAddress,
        username: userCurrent?.username,
      }
    });
    if (updatedProfile) {
      return updatedProfile;
    } else if (profile) {
      return profile;
    }
  }

  return redirect("/");
}
