"use client";

import { LoadingOverlay } from "@/components/loading-overlay";
import { ProfileForm } from "@/components/profile-form";
import { useSessionStore } from "@/lib/hooks/session-provider";
import { ProfileFormSchema } from "@/lib/types/profile-form-schema";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateProfile() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { accessToken } = useSessionStore((state) => state);
  const router = useRouter();
  async function onSubmit(values: ProfileFormSchema): Promise<void> {
    console.log("values: ", values);
    setIsSubmitted(true);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("profile-picture", values.profilePicture);
    console.log("file: ", formData.get("profile-picture"));
    const response: Response = await fetch(
      `${process.env.NEXT_PUBLIC_PROFILE_API_URL}/profile`,
      {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${accessToken}`,
        }),
        body: formData,
      }
    );
    if (response.status == 200) {
      setIsSubmitted(true);
      router.push("/");
    } else {
      alert("some errors occured");
    }
  }
  return (
    <LoadingOverlay visible={isSubmitted} message="Signing in...">
      <ProfileForm isSubmitted={isSubmitted} onSubmit={onSubmit} />
    </LoadingOverlay>
  );
}
