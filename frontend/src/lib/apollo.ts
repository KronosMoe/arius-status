import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'http://localhost:4001/graphql',
      credentials: 'include',
    }),
    cache: new InMemoryCache(),
  })
}

export const apolloClient = createApolloClient()
