"use client";
import { LoadingOverlay } from "@/components/loading-overlay";
import { LoginForm } from "@/components/login-form";
import { LoginFormSchema } from "@/lib/types/loin-form-schema";
import { useState } from "react";
import { z } from "zod";

export default function Login() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    setIsSubmitted(true);
    console.log(values);
  }
  return (
    <LoadingOverlay visible={isSubmitted} message="Signing in...">
      <LoginForm isSubmitted={isSubmitted} onSubmit={onSubmit} />
    </LoadingOverlay>
  );
}
