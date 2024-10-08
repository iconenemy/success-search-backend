export type SignInRequest = {
  email: string;
  password: string;
};

export type SignInResponse = {
  id: string;
  email: string;
  accessToken: string;
  refreshToken: string;
};
