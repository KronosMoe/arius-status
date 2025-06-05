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

export const GET_STATUS_BY_ID = gql`
  query GetStatusPageById($id: String!) {
    getStatusPageById(id: $id) {
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

export const UPDATE_STATUS_PAGE_MUTATION = gql`
  mutation UpdateStatusPage($id: String!, $input: CreateStatusPageInput!) {
    updateStatusPage(id: $id, input: $input) {
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

export const DELETE_STATUS_PAGE_MUTATION = gql`
  mutation DeleteStatusPage($id: String!) {
    deleteStatusPage(id: $id) {
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
