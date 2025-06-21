export const Translation = {
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
}
