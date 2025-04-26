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
