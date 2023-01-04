export function generateId(
    length: number,
    // eslint-disable-next-line max-len
    characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function getBearerToken(authorization?: string) {
  return authorization?.split(" ")[1] || "";
}
