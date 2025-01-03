"use client";
import { SignupFormSchema } from "@/lib/types/signup-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import Link from "next/link";

interface signup {
  isSubmitted: boolean;
  onSubmit(values: z.infer<typeof SignupFormSchema>): void;
}
export function SignupForm({ isSubmitted, onSubmit }: signup) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const form = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  function toggleIsPasswordVisible() {
    setIsPasswordVisible((prevState) => !prevState);
  }
  return (
    <div className="flex flex-col h-14/15 w-full justify-center items-center">
      <Card className="w-5/6">
        <CardHeader>
          <CardTitle>Signup</CardTitle>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="chill-guy"
                          {...field}
                          disabled={isSubmitted}
                        />
                      </FormControl>
                      <FormDescription>
                        Username should be unique
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="chill@guy.com"
                          {...field}
                          disabled={isSubmitted}
                        />
                      </FormControl>
                      <FormDescription>
                        Email should be a valid Email address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="flex w-full items-center ml-1">
                          <Input
                            type={isPasswordVisible ? "text" : "password"}
                            {...field}
                            disabled={isSubmitted}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={toggleIsPasswordVisible}
                            disabled={isSubmitted}
                          >
                            {isPasswordVisible ? <EyeClosed /> : <Eye />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Password should be 8-15 characters long
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  key={isSubmitted ? 1 : 0}
                  type="submit"
                  className={
                    isSubmitted
                      ? "bg-primaryContainer text-onPrimaryContainer transition ease-in duration-500"
                      : ""
                  }
                  disabled={isSubmitted}
                >
                  Signup
                </Button>
              </form>
            </Form>
            <div className="text-sm mt-1">
              Already have an account?{" "}
              <Link href="/login" className="text-onPrimaryContainer">
                Login
              </Link>
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
