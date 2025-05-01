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

export const UPDATE_TIMEZONE_MUTATION = gql`
  mutation UpdateTimezone($timezone: String!) {
    updateTimezone(timezone: $timezone) {
      id
      theme
      timezone
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
      webhookUrl
      isDefault
      content
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
      webhookUrl
      content
      isDefault
      message
      createdAt
    }
  }
`

export const UPDATE_NOTIFICATION_MUTATION = gql`
  mutation UpdateNotificationSetting(
    $updateNotificationInput: UpdateNotificationInput!
    $updateNotificationSettingId: String!
  ) {
    updateNotificationSetting(updateNotificationInput: $updateNotificationInput, id: $updateNotificationSettingId) {
      content
      createdAt
      id
      isDefault
      message
      method
      title
      webhookUrl
    }
  }
`

export const DELETE_NOTIFICATION_MUTATION = gql`
  mutation DeleteNotificationSetting($deleteNotificationSettingId: String!) {
    deleteNotificationSetting(id: $deleteNotificationSettingId) {
      content
      createdAt
      id
      isDefault
      message
      method
      title
      webhookUrl
    }
  }
`
