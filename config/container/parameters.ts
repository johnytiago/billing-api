import config from 'config';
import { ParametersList, IContainerParameterItem } from './items/parameter';

export const parameters: ParametersList = new Map([
    [
        "appName", 
        { value: config.get('appName')}
    ],
    [
        "logLevel",
        { value: config.get('logger.logLevel')}
    ],
    [
        "env",
        { value: config.get('env')}
    ],
    [
        "port", 
        { value: config.get('http.port')}
    ],
    [
        "eventStore.margin", 
        { value: config.get('eventStore.margin')}
    ],
]);