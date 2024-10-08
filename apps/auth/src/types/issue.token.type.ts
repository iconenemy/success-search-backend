export type IssueTokenRequest = {
  email: string;
  id: string;
};

export type IssueTokenResponse = {
  accessToken: string;
  refreshToken: string;
};
