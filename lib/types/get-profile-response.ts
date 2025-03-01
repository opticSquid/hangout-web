export interface ProfileData {
  profileId: string;
  userId: string;
  name: string;
  profilePicture: {
    filename: string;
    contentType: string;
  };
}
