import { gql } from '@apollo/client'

export const AGENTS_QUERY = gql`
  query FindAgentsByUserId {
    findAgentsByUserId {
      id
      name
      token
      isOnline
      createdAt
    }
  }
`

export const CREATE_AGENT_MUTATION = gql`
  mutation CreateAgent($createAgentInput: CreateAgentInput!) {
    createAgent(createAgentInput: $createAgentInput) {
      id
      name
      token
      isOnline
      createdAt
    }
  }
`
