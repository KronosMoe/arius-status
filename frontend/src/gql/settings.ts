import { gql } from '@apollo/client'

export const SETTINGS_QUERY = gql`
  query GetSettingsByUserId {
    getSettingsByUserId {
      theme
    }
  }
`

export const UPDATE_THEME_MUTATION = gql`
  mutation Mutation($theme: String!) {
    updateTheme(theme: $theme) {
      theme
    }
  }
`
