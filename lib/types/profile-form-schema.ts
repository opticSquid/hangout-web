import { z } from "zod";

export interface ProfileFormSchema {
  name: string;
  profilePicture: File;
}
