import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'

interface ConnectedAgent {
  socket: Socket
  agentId: number
  userId: number
}

@WebSocketGateway()
export class PingGateway {
  @WebSocketServer() server: Server

  private connectedAgents = new Map<number, ConnectedAgent>()

  handleConnection(client: Socket) {
    client.on('register', (data: { agentId: number; userId: number }) => {
      this.connectedAgents.set(data.agentId, {
        socket: client,
        agentId: data.agentId,
        userId: data.userId,
      })
      console.log(`Agent ${data.agentId} (User ${data.userId}) registered`)
    })
  }

  handleDisconnect(client: Socket) {
    for (const [agentId, agent] of this.connectedAgents) {
      if (agent.socket.id === client.id) {
        this.connectedAgents.delete(agentId)
        console.log(`Agent ${agentId} disconnected`)
        break
      }
    }
  }

  getAgentSocket(agentId: number): Socket | undefined {
    return this.connectedAgents.get(agentId)?.socket
  }

  async sendPingToAgentWithResult(
    socketId: string,
    targetAddress: string,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const socket = this.server.sockets.sockets.get(socketId)
      if (!socket) {
        return reject(new Error('Agent inaccessible'))
      }

      const timeout = setTimeout(() => {
        reject(new Error('Ping timeout'))
      }, 5000)

      const listener = (result) => {
        clearTimeout(timeout)
        socket.off('pingResult', listener)
        resolve(result)
      }

      socket.on('pingResult', listener)
      socket.emit('ping', JSON.stringify({ targetAddress }))
    })
  }
}
