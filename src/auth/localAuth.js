const USER = import.meta.env.PUBLIC_AUTH_USER;
const PASS = import.meta.env.PUBLIC_AUTH_PASS;

export function authenticate(username, password) {
  return username === USER && password === PASS;
}