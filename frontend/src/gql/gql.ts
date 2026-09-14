/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query ActivityForecast($input: ActivityForecastInput!) {\n  activityForecast(input: $input) {\n    location {\n      name\n      latitude\n      longitude\n      country\n    }\n    days {\n      date\n      skiing {\n        ...ActivityScoreFields\n      }\n      outdoorSightseeing {\n        ...ActivityScoreFields\n      }\n      indoorSightseeing {\n        ...ActivityScoreFields\n      }\n      surfing {\n        available\n        score\n        reasons\n        bestHour\n        unavailableReason\n      }\n    }\n  }\n}": typeof types.ActivityForecastDocument,
    "fragment ActivityScoreFields on ActivityScoreType {\n  score\n  reasons\n}": typeof types.ActivityScoreFieldsFragmentDoc,
};
const documents: Documents = {
    "query ActivityForecast($input: ActivityForecastInput!) {\n  activityForecast(input: $input) {\n    location {\n      name\n      latitude\n      longitude\n      country\n    }\n    days {\n      date\n      skiing {\n        ...ActivityScoreFields\n      }\n      outdoorSightseeing {\n        ...ActivityScoreFields\n      }\n      indoorSightseeing {\n        ...ActivityScoreFields\n      }\n      surfing {\n        available\n        score\n        reasons\n        bestHour\n        unavailableReason\n      }\n    }\n  }\n}": types.ActivityForecastDocument,
    "fragment ActivityScoreFields on ActivityScoreType {\n  score\n  reasons\n}": types.ActivityScoreFieldsFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query ActivityForecast($input: ActivityForecastInput!) {\n  activityForecast(input: $input) {\n    location {\n      name\n      latitude\n      longitude\n      country\n    }\n    days {\n      date\n      skiing {\n        ...ActivityScoreFields\n      }\n      outdoorSightseeing {\n        ...ActivityScoreFields\n      }\n      indoorSightseeing {\n        ...ActivityScoreFields\n      }\n      surfing {\n        available\n        score\n        reasons\n        bestHour\n        unavailableReason\n      }\n    }\n  }\n}"): (typeof documents)["query ActivityForecast($input: ActivityForecastInput!) {\n  activityForecast(input: $input) {\n    location {\n      name\n      latitude\n      longitude\n      country\n    }\n    days {\n      date\n      skiing {\n        ...ActivityScoreFields\n      }\n      outdoorSightseeing {\n        ...ActivityScoreFields\n      }\n      indoorSightseeing {\n        ...ActivityScoreFields\n      }\n      surfing {\n        available\n        score\n        reasons\n        bestHour\n        unavailableReason\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment ActivityScoreFields on ActivityScoreType {\n  score\n  reasons\n}"): (typeof documents)["fragment ActivityScoreFields on ActivityScoreType {\n  score\n  reasons\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;