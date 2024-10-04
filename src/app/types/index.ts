export type LoginError = {
  message: string;
};

export type LoginSuccess = {
  token: string;
  refreshToken: string;
};

export type LoginResponse = LoginSuccess | LoginError;

export type Login = {
  email: string;
  password: string;
};
