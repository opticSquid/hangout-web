"use client";
import { EmailVerificationAlert } from "@/components/email-verification-alert";
import { LoadingOverlay } from "@/components/loading-overlay";
import { SignupForm } from "@/components/signup-form";
import { SignupFormSchema } from "@/lib/types/signup-form-schema";
import { SignupResponse } from "@/lib/types/signup-response-interface";
import { useState } from "react";
import { z } from "zod";

export default function Signup() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  async function onSubmit(values: z.infer<typeof SignupFormSchema>) {
    setIsSubmitted(true);
    try {
      const response: Response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth-api/v1/public/signup`,
        {
          method: "POST",
          headers: new Headers({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify(values),
        }
      );
      if (response.status === 200) {
        const data: SignupResponse = await response.json();
        setShowAlert(true);
      }
    } catch (error: unknown) {
      console.error(
        "could not perform http request. Something went wrong, error: ",
        error
      );
    } finally {
      setIsSubmitted(false);
    }
  }
  return (
    <>
      <LoadingOverlay visible={isSubmitted} message="Signing up...">
        <SignupForm isSubmitted={isSubmitted} onSubmit={onSubmit} />
      </LoadingOverlay>
      <EmailVerificationAlert open={showAlert} />
    </>
  );
}
