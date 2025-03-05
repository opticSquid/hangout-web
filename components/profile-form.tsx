import { ProfileFormSchema } from "@/lib/types/profile-form-schema";
import { FormEvent, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface Profile {
  isSubmitted: boolean;
  onSubmit(values: ProfileFormSchema): void;
}
export function ProfileForm({ isSubmitted, onSubmit }: Profile) {
  const nameRef = useRef<HTMLInputElement>(null);
  const profilePicRef = useRef<HTMLInputElement>(null);
  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      nameRef.current &&
      profilePicRef.current &&
      profilePicRef.current.files &&
      profilePicRef.current.files[0]
    ) {
      const formData: ProfileFormSchema = {
        name: nameRef.current.value,
        profilePicture: profilePicRef.current.files[0],
      };
      onSubmit(formData);
    } else {
      alert("Input fields are empty");
    }
  }
  return (
    <div className="flex flex-col h-14/15 w-full justify-center items-center">
      <Card className="w-5/6">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Toby Maguire"
                  ref={nameRef}
                  disabled={isSubmitted}
                  required
                />
              </div>
              <div>
                <Label htmlFor="profilePicture">Profile Picture</Label>
                <Input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  disabled={isSubmitted}
                  ref={profilePicRef}
                  required
                />
              </div>
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
                Create
              </Button>
            </form>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
