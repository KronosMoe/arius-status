import { gql } from '@apollo/client'

export const ME_QUERY = gql`
  query Me {
    me {
      username
      image
      settings {
        theme
      }
    }
  }
`

export const LOGOUT_MUTATION = gql`
  mutation Mutation {
    logout
  }
`

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input)
  }
`

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input)
  }
`

// Github OAuth
export const GITHUB_OAUTH_URL_QUERY = gql`
  query GithubOauthUrl {
    getGithubOAuthUrl
  }
`
