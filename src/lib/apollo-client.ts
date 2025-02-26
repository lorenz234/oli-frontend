import { ApolloClient, InMemoryCache } from '@apollo/client';

const GRAPHQL_URL="https://base.easscan.org/graphql"

const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache()
});

export default client;