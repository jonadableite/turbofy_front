import pino from 'pino';

const transport = process.env.NODE_ENV !== 'production' 
  ? { 
      target: 'pino-pretty', 
      options: { 
        colorize: true,
        translateTime: 'SYS:HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat: '{msg}',
        customColors: 'info:blue,warn:yellow,error:red,debug:magenta',
        errorLikeObjectKeys: ['err', 'error'],
        singleLine: false,
        levelFirst: true,
      } 
    } 
  : undefined;

export const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
  transport,
});