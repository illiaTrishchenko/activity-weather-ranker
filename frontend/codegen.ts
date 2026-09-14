import type { CodegenConfig } from "@graphql-codegen/cli";
import { loadEnv } from "vite";

const env = loadEnv("development", process.cwd(), "");
const graphqlUrl = env.VITE_GRAPHQL_URL;

if (!graphqlUrl) {
  throw new Error("VITE_GRAPHQL_URL is required for GraphQL Code Generator");
}

const config: CodegenConfig = {
  schema: graphqlUrl,
  documents: ["src/**/*.graphql"],
  generates: {
    "./src/gql/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        useTypeImports: true,
      },
    },
  },
};

export default config;
