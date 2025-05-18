export interface JwtPayload {
  sub: string;   // the email
  iat: number;   // issued‐at (seconds since epoch)
  exp: number;   // expiration (seconds since epoch)
}

