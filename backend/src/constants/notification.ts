import { Monitor } from 'src/monitors/entities/monitor.entity'

export function getDiscordEmbed(monitor: Monitor, isDown = false) {
  return {
    title: `Your service ${monitor.name} is ${isDown ? 'down' : 'up'}`,
    description: `**Service Name**\n${monitor.name}\n\n**Service Address**\n${monitor.address}\n\n**Time**\n${new Date()}`,
    color: isDown ? 15158332 : 3066993,
    footer: {
      text: '©2025 Arius Statuspage',
    },
  }
}
