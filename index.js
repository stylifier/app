/** @format */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader', 'Class RCTCxxModule', 'Required dispatch_sync to load constants for RNDeviceInfo. This may lead to deadlocks', 'Remote debugger', 'Task orphaned for request', 'Warning: isMounted(...)'])

AppRegistry.registerComponent(appName, () => App);
