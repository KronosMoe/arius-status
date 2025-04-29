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

export const NOTIFICATION_QUERY = gql`
  query GetNotificationSettingsByUserId {
    getNotificationSettingsByUserId {
      id
      title
      method
      message
      metadata
      createdAt
    }
  }
`

export const CREATE_NOTIFICATION_MUTATION = gql`
  mutation CreateNotificationSetting($createNotificationInput: CreateNotificationInput!) {
    createNotificationSetting(createNotificationInput: $createNotificationInput) {
      id
      title
      method
      message
      metadata
      createdAt
    }
  }
`
