/**
 * Parse a boolean value from an environment variable.
 *
 * @param value The environment variable value to parse
 * @returns Boolean value or undefined if the input is undefined
 */
export function parseBooleanEnv(value?: string): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }

  return value === "true" || value === "1";
}
