"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginFormSchema } from "@/lib/types/loin-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface login {
  isSubmitted: boolean;
  onSubmit(values: z.infer<typeof LoginFormSchema>): void;
}
export function LoginForm({ isSubmitted, onSubmit }: login) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: "",
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
          <CardTitle>Login</CardTitle>
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
                  Login
                </Button>
              </form>
            </Form>
            <div className="text-sm mt-1">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-onPrimaryContainer">
                Signup
              </Link>
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
