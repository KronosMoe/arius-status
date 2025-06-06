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

export const RENAME_AGENT_MUTATION = gql`
  mutation RenameAgentById($id: String!, $name: String!) {
    renameAgentById(id: $id, name: $name) {
      id
      name
      token
      isOnline
      createdAt
    }
  }
`

export const DELETE_AGENT_MUTATION = gql`
  mutation DeleteAgentById($id: String!) {
    deleteAgentById(id: $id) {
      id
      name
      token
      isOnline
      createdAt
    }
  }
`
