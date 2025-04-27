import { gql } from '@apollo/client'

export const MONITORS_QUERY = gql`
  query FindMonitorsByUserId {
    findMonitorsByUserId {
      id
      name
      type
      status
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
      status
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

export const PAUSE_MONITOR_MUTATION = gql`
  mutation PauseMonitorById($pauseMonitorByIdId: String!) {
    pauseMonitorById(id: $pauseMonitorByIdId) {
      id
      name
      type
      status
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

export const RESUME_MONITOR_MUTATION = gql`
  mutation ResumeMonitorById($resumeMonitorByIdId: String!) {
    resumeMonitorById(id: $resumeMonitorByIdId) {
      id
      name
      type
      status
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

export const DELETE_MONITOR_MUTATION = gql`
  mutation UpdateMonitorById($deleteMonitorByIdId: String!) {
    deleteMonitorById(id: $deleteMonitorByIdId) {
      id
      name
      type
      status
      address
      agentId
      interval
      createdAt
    }
  }
`

export const UPDATE_MONITOR_MUTATION = gql`
  mutation UpdateMonitorById($updateMonitorByIdId: String!, $updateMonitorInput: UpdateMonitorInput!) {
    updateMonitorById(id: $updateMonitorByIdId, updateMonitorInput: $updateMonitorInput) {
      id
      name
      type
      status
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
      status
      address
      agentId
      interval
      createdAt
    }
  }
`
