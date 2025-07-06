export const envVar = {
  get<T>(envVarName: string): T {
    const result = process.env[envVarName];
    if (!result) throw new Error(`${envVarName} not defined`);

    return result as unknown as T
  },

  get basePublicURL(): string {
    return this.get("NEXT_PUBLIC_API_URL");
  }
}
