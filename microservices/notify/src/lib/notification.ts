import { Agents, Monitors } from '@prisma/client'

export function getDiscordMonitorEmbed(monitor: Monitors, isDown = false) {
  return [
    {
      title: `Your service ${monitor.name} is ${isDown ? 'down' : 'up'}`,
      description: `**Service Name**\n${monitor.name}\n\n**Service Address**\n${monitor.address}\n\n**Time**\n${new Date()}`,
      color: isDown ? 15158332 : 3066993,
      footer: {
        text: '© 2025 Arius Statuspage',
      },
    },
  ]
}

export function getDiscordAgentEmbed(agent: Agents, isDown = false) {
  return [
    {
      title: `Your agent ${agent.name} is ${isDown ? 'down' : 'up'}`,
      description: `**Time**\n${new Date()}`,
      color: isDown ? 15158332 : 3066993,
      footer: {
        text: '© 2025 Arius Statuspage',
      },
    },
  ]
}
