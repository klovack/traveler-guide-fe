export const envVar = {
  get<T>(envVarName: string): T {
    const result = process.env[envVarName];
    if (!result) throw new Error(`${envVarName} not defined`);

    return result as unknown as T
  },

  safeGet<T>(envVarName: string): T | undefined {
    try {
      return this.get<T>(envVarName);
    } catch (error) {
      console.warn("Trying to get not existing env var", envVarName);
    }
  },

  get basePublicURL(): string {
    return this.get("NEXT_PUBLIC_API_URL");
  }
}
