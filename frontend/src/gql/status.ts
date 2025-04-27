import { gql } from '@apollo/client'

export const STATUS_QUERY = gql`
  query GetStatusByMonitorId($monitorId: String!) {
    getStatusByMonitorId(monitorId: $monitorId) {
      id
      createdAt
      metadata
      responseTime
    }
  }
`
