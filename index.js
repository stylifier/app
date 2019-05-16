/** @format */
import { Sentry } from 'react-native-sentry'
Sentry.config('https://fd55336f275541d38ce0d06c59ec9633@sentry.io/1340306').install()

import { AppRegistry, YellowBox } from 'react-native'
import App from './App'
import { name as appName } from './app.json'

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader', 'Class RCTCxxModule', 'Required dispatch_sync to load constants for RNDeviceInfo. This may lead to deadlocks', 'Remote debugger', 'Task orphaned for request', 'Warning: isMounted(...)'])

AppRegistry.registerComponent(appName, () => App)
