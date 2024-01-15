const auth_path = ['signin', 'signin-validation'];

export function controlPath(path: string): boolean {
  return auth_path.includes(path);
}
