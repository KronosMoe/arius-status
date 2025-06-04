import { gql } from '@apollo/client'

export const GET_STATUS_PAGES = gql`
  query GetStatusPage {
    getStatusPagesByUserId {
      id
      name
      logo
      slug
      createdAt
    }
  }
`

export const GET_STATUS_BY_SLUG = gql`
  query GetStatusPageBySlug($slug: String!) {
    getStatusPageBySlug(slug: $slug) {
      id
      name
      logo
      slug
      isFullWidth
      showOverallStatus
      footerText
      createdAt
      selectedMonitors {
        id
        monitorId
        type
        createdAt
      }
      statusCards {
        address
        agentId
        createdAt
        id
        interval
        status
        name
        type
      }
      statusLines {
        address
        agentId
        createdAt
        id
        interval
        status
        name
        type
      }
    }
  }
`

export const CREATE_STATUS_PAGE_MUTATION = gql`
  mutation CreateStatusPage($input: CreateStatusPageInput!) {
    createStatusPage(input: $input) {
      id
      name
      logo
      slug
      isFullWidth
      showOverallStatus
      footerText
      createdAt
      selectedMonitors {
        id
        monitorId
        type
        createdAt
      }
    }
  }
`
