"use client";
import { LoadingOverlay } from "@/components/loading-overlay";
import { SignupForm } from "@/components/signup-form";
import { SignupFormSchema } from "@/lib/types/signup-form-schema";
import { useState } from "react";
import { z } from "zod";

export default function Signup() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  function onSubmit(values: z.infer<typeof SignupFormSchema>) {
    setIsSubmitted(true);
    console.log(values);
  }
  return (
    <LoadingOverlay visible={isSubmitted} message="Signing up...">
      <SignupForm isSubmitted={isSubmitted} onSubmit={onSubmit} />
    </LoadingOverlay>
  );
}
