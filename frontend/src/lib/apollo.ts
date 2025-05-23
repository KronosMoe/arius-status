import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4001/graphql',
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
})
