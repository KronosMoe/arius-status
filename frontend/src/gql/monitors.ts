import { gql } from '@apollo/client'

export const MONITORS_QUERY = gql`
  query FindMonitorsByUserId {
    findMonitorsByUserId {
      id
      name
      type
      address
      agentId
      interval
      createdAt
    }
  }
`

export const FIND_MONITOR_BY_ID_QUERY = gql`
  query FindMonitorById($findMonitorByIdId: String!) {
    findMonitorById(id: $findMonitorByIdId) {
      id
      name
      type
      interval
      address
      createdAt
      agent {
        name
        isOnline
      }
    }
  }
`

export const CREATE_MONITOR_MUTATION = gql`
  mutation CreateMonitor($createMonitorInput: CreateMonitorInput!) {
    createMonitor(createMonitorInput: $createMonitorInput) {
      id
      name
      type
      address
      agentId
    }
  }
`
