export const Translation = {
  nav: {
    dashboard: 'nav.dashboard',
    status-page: 'nav.status-page',
    settings: 'nav.settings',
    sign-out: 'nav.sign-out',
    search: {
      placeholder: 'nav.search.placeholder',
    },
    command: {
      navigation: 'nav.command.navigation',
      action: 'nav.command.action',
      placeholder: 'nav.command.placeholder',
      no-results: 'nav.command.no-results',
    },
  },
  dashboard: {
    header: {
      title: 'dashboard.header.title',
      description: 'dashboard.header.description',
      button: {
        refresh: 'dashboard.header.button.refresh',
      },
      stats: {
        total-monitors: 'dashboard.header.stats.total-monitors',
        active-monitors: 'dashboard.header.stats.active-monitors',
        paused-monitors: 'dashboard.header.stats.paused-monitors',
        total-agents: 'dashboard.header.stats.total-agents',
      },
    },
    tabs: {
      monitors: 'dashboard.tabs.monitors',
      agents: 'dashboard.tabs.agents',
    },
    list: {
      title-monitor: 'dashboard.list.title-monitor',
      title-agent: 'dashboard.list.title-agent',
    },
    create-monitor-form: {
      title: 'dashboard.create-monitor-form.title',
      submit: 'dashboard.create-monitor-form.submit',
      toast: 'dashboard.create-monitor-form.toast',
      validation: {
        name: {
          required: 'dashboard.create-monitor-form.validation.name.required',
        },
        type: {
          required: 'dashboard.create-monitor-form.validation.type.required',
        },
        address: {
          required: 'dashboard.create-monitor-form.validation.address.required',
        },
        agent: {
          required: 'dashboard.create-monitor-form.validation.agent.required',
        },
        interval: {
          min: 'dashboard.create-monitor-form.validation.interval.min',
          max: 'dashboard.create-monitor-form.validation.interval.max',
          positive: 'dashboard.create-monitor-form.validation.interval.positive',
        },
        refine: {
          address: 'dashboard.create-monitor-form.validation.refine.address',
        },
      },
      name: {
        label: 'dashboard.create-monitor-form.name.label',
        placeholder: 'dashboard.create-monitor-form.name.placeholder',
      },
      type: {
        label: 'dashboard.create-monitor-form.type.label',
        placeholder: 'dashboard.create-monitor-form.type.placeholder',
      },
      address: {
        label: 'dashboard.create-monitor-form.address.label',
        placeholder: 'dashboard.create-monitor-form.address.placeholder',
      },
      interval: {
        label: 'dashboard.create-monitor-form.interval.label',
        placeholder: 'dashboard.create-monitor-form.interval.placeholder',
      },
      agent: {
        label: 'dashboard.create-monitor-form.agent.label',
        placeholder: 'dashboard.create-monitor-form.agent.placeholder',
      },
    },
    create-agent-form: {
      title: 'dashboard.create-agent-form.title',
      toast: 'dashboard.create-agent-form.toast',
      submit: 'dashboard.create-agent-form.submit',
    },
    error: {
      title: 'dashboard.error.title',
      message: 'dashboard.error.message',
      button: 'dashboard.error.button',
    },
  },
  monitor: {
    info: {
      target: 'monitor.info.target',
      interval: 'monitor.info.interval',
      type: 'monitor.info.type',
      overview: {
        title: 'monitor.info.overview.title',
        check: 'monitor.info.overview.check',
        time: {
          now: 'monitor.info.overview.time.now',
        },
      },
      metrics: {
        title: 'monitor.info.metrics.title',
        uptime: 'monitor.info.metrics.uptime',
        total-check: 'monitor.info.metrics.total-check',
      },
    },
    action: {
      button: 'monitor.action.button',
      pause: {
        button: 'monitor.action.pause.button',
        toast: 'monitor.action.pause.toast',
      },
      resume: {
        button: 'monitor.action.resume.button',
        toast: 'monitor.action.resume.toast',
      },
      edit: {
        button: 'monitor.action.edit.button',
      },
      delete: {
        button: 'monitor.action.delete.button',
        cancel: 'monitor.action.delete.cancel',
        toast: 'monitor.action.delete.toast',
        confirmation: {
          title: 'monitor.action.delete.confirmation.title',
          description: 'monitor.action.delete.confirmation.description',
        },
      },
    },
    edit-monitor-form: {
      title: 'monitor.edit-monitor-form.title',
      toast: 'monitor.edit-monitor-form.toast',
      submit: 'monitor.edit-monitor-form.submit',
    },
  },
  agent: {
    delete: {
      button: 'agent.delete.button',
      cancel: 'agent.delete.cancel',
      toast: 'agent.delete.toast',
      confirmation: {
        title: 'agent.delete.confirmation.title',
        description: 'agent.delete.confirmation.description',
      },
    },
    edit-agent-form: {
      title: 'agent.edit-agent-form.title',
      validation: {
        name: {
          required: 'agent.edit-agent-form.validation.name.required',
          refine: 'agent.edit-agent-form.validation.name.refine',
        },
      },
      toast: 'agent.edit-agent-form.toast',
      button: 'agent.edit-agent-form.button',
      submit: 'agent.edit-agent-form.submit',
      cancel: 'agent.edit-agent-form.cancel',
      name: {
        label: 'agent.edit-agent-form.name.label',
        placeholder: 'agent.edit-agent-form.name.placeholder',
        description: 'agent.edit-agent-form.name.description',
      },
    },
  },
  settings: {
    title: 'settings.title',
    description: 'settings.description',
    appearance: {
      title: 'settings.appearance.title',
      description: 'settings.appearance.description',
      theme: {
        light: 'settings.appearance.theme.light',
        dark: 'settings.appearance.theme.dark',
        toast: 'settings.appearance.theme.toast',
      },
    },
    language: {
      title: 'settings.language.title',
      description: 'settings.language.description',
      toast: 'settings.language.toast',
    },
    notification: {
      title: 'settings.notification.title',
      description: 'settings.notification.description',
      list: {
        title: 'settings.notification.list.title',
        created: 'settings.notification.list.created',
        default: 'settings.notification.list.default',
      },
      empty: {
        title: 'settings.notification.empty.title',
        description: 'settings.notification.empty.description',
      },
      button: 'settings.notification.button',
      remove-dialog: {
        title: 'settings.notification.remove-dialog.title',
        description: 'settings.notification.remove-dialog.description',
        toast: 'settings.notification.remove-dialog.toast',
        cancel: 'settings.notification.remove-dialog.cancel',
        submit: 'settings.notification.remove-dialog.submit',
      },
      edit-notification-form: {
        title: 'settings.notification.edit-notification-form.title',
        toast: 'settings.notification.edit-notification-form.toast',
        isDefault: {
          label: 'settings.notification.edit-notification-form.isDefault.label',
        },
        submit: 'settings.notification.edit-notification-form.submit',
        cancel: 'settings.notification.edit-notification-form.cancel',
      },
      create-notification-form: {
        title: 'settings.notification.create-notification-form.title',
        toast: 'settings.notification.create-notification-form.toast',
        submit: 'settings.notification.create-notification-form.submit',
        cancel: 'settings.notification.create-notification-form.cancel',
        webhook-test: {
          button: 'settings.notification.create-notification-form.webhook-test.button',
          toast: 'settings.notification.create-notification-form.webhook-test.toast',
        },
        validation: {
          name: {
            required: 'settings.notification.create-notification-form.validation.name.required',
          },
          method: {
            required: 'settings.notification.create-notification-form.validation.method.required',
          },
          email-content: {
            required: 'settings.notification.create-notification-form.validation.email-content.required',
          },
          webhook: {
            required: 'settings.notification.create-notification-form.validation.webhook.required',
            invalid: 'settings.notification.create-notification-form.validation.webhook.invalid',
          },
        },
        name: {
          label: 'settings.notification.create-notification-form.name.label',
          placeholder: 'settings.notification.create-notification-form.name.placeholder',
        },
        method: {
          label: 'settings.notification.create-notification-form.method.label',
          placeholder: 'settings.notification.create-notification-form.method.placeholder',
        },
        email-content: {
          label: 'settings.notification.create-notification-form.email-content.label',
          placeholder: 'settings.notification.create-notification-form.email-content.placeholder',
        },
        message: {
          label: 'settings.notification.create-notification-form.message.label',
          placeholder: 'settings.notification.create-notification-form.message.placeholder',
        },
        webhook: {
          label: 'settings.notification.create-notification-form.webhook.label',
          placeholder: 'settings.notification.create-notification-form.webhook.placeholder',
        },
      },
    },
    devices: {
      title: 'settings.devices.title',
      description: 'settings.devices.description',
      active-session: 'settings.devices.active-session',
      expires: 'settings.devices.expires',
      created: 'settings.devices.created',
      remove-device-dialog: {
        title: 'settings.devices.remove-device-dialog.title',
        description: 'settings.devices.remove-device-dialog.description',
        toast: 'settings.devices.remove-device-dialog.toast',
        cancel: 'settings.devices.remove-device-dialog.cancel',
        submit: 'settings.devices.remove-device-dialog.submit',
      },
      danger-zone: {
        title: 'settings.devices.danger-zone.title',
        description: 'settings.devices.danger-zone.description',
        button: 'settings.devices.danger-zone.button',
        dialog: {
          title: 'settings.devices.danger-zone.dialog.title',
          description: 'settings.devices.danger-zone.dialog.description',
          toast: 'settings.devices.danger-zone.dialog.toast',
          cancel: 'settings.devices.danger-zone.dialog.cancel',
          submit: 'settings.devices.danger-zone.dialog.submit',
        },
      },
    },
    about: {
      title: 'settings.about.title',
    },
  },
}
