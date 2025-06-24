export const BASE_PATH = '/'
export const PRIVACY_POLICY_PATH = BASE_PATH + 'privacy-policy'

export const AUTH_PATH = BASE_PATH + 'auth/'
export const SIGN_IN_PATH = AUTH_PATH + 'sign-in'
export const SIGN_UP_PATH = AUTH_PATH + 'sign-up'

export const DASHBOARD_PATH = BASE_PATH + 'dashboard'
export const SETTING_PATH = BASE_PATH + 'setting'
export const MONITOR_INFO_PATH = BASE_PATH + 'monitor/:monitorId'
export const AGENT_INFO_PATH = BASE_PATH + 'agent/:agentId'

export const STATUS_PAGE_PATH = BASE_PATH + 'status-page/'
export const STATUS_PAGE_CREATION_PATH = STATUS_PAGE_PATH + 'create'
export const STATUS_PAGE_EDIT_PATH = STATUS_PAGE_PATH + 'edit/:id'
export const STATUS_PAGE_FULL_PATH = BASE_PATH + 'status/' + ':slug'

export const NOT_FOUND_PATH = '*'