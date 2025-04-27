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

export const STATUS_BY_TIME_RANGE_QUERY = gql`
  query GetStatusByTimeRange($from: DateTime!, $to: DateTime!, $monitorId: String!) {
    getStatusByTimeRange(from: $from, to: $to, monitorId: $monitorId) {
      id
      metadata
      responseTime
      createdAt
    }
  }
`
