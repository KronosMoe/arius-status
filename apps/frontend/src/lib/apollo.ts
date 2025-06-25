import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.DEV ? 'http://localhost:4000/graphql' : '/graphql',
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
})
