import { ApolloClient, InMemoryCache } from '@apollo/client';

const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL as string;

// Ensure the URL has a protocol
const ensureAbsoluteUrl = (url:string) => {
  if (!url) return '/api/graphql'; // Fallback to a default relative path
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url; // Already has protocol
  }
  
  // Add https protocol if missing
  return `https://${url}`;
};

const client = new ApolloClient({
  uri: ensureAbsoluteUrl(graphqlUrl),
  cache: new InMemoryCache()
});

export default client;