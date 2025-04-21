import { ReadonlyURLSearchParams } from "next/navigation";

export const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams,
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;

export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = ["CUSTOMER_GRAPH_TOKEN", "SITE_NAME"];
  const missingEnvironmentVariables = [] as string[];

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  });

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them:\n\n${missingEnvironmentVariables.join(
        "\n",
      )}\n`,
    );
  }

  // Additional validation for optional environment variables
  if (process.env.DEPLOYMENT_PLATFORM) {
    const validPlatforms = ["vercel", "cloudflare"];
    if (
      !validPlatforms.includes(process.env.DEPLOYMENT_PLATFORM.toLowerCase())
    ) {
      console.warn(
        `Warning: DEPLOYMENT_PLATFORM value "${process.env.DEPLOYMENT_PLATFORM}" is not recognized. Valid values are: ${validPlatforms.join(", ")}`,
      );
    }
  }
};
