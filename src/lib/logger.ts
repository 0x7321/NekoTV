/* eslint-disable no-console, @typescript-eslint/no-explicit-any */

/**
 * 智能日志工具
 * 开发环境输出所有日志，生产环境只输出 warn 和 error
 */

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * 普通日志 - 仅在开发环境输出
   */
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args);
    }
  },

  /**
   * 信息日志 - 仅在开发环境输出
   */
  info: (...args: any[]) => {
    if (isDev) {
      console.info(...args);
    }
  },

  /**
   * 调试日志 - 仅在开发环境输出
   */
  debug: (...args: any[]) => {
    if (isDev) {
      console.debug(...args);
    }
  },

  /**
   * 警告日志 - 始终输出
   */
  warn: (...args: any[]) => {
    console.warn(...args);
  },

  /**
   * 错误日志 - 始终输出
   */
  error: (...args: any[]) => {
    console.error(...args);
  },

  /**
   * 计时开始 - 仅在开发环境
   */
  time: (label: string) => {
    if (isDev) {
      console.time(label);
    }
  },

  /**
   * 计时结束 - 仅在开发环境
   */
  timeEnd: (label: string) => {
    if (isDev) {
      console.timeEnd(label);
    }
  },

  /**
   * 表格输出 - 仅在开发环境
   */
  table: (data: any) => {
    if (isDev) {
      console.table(data);
    }
  },

  /**
   * 分组开始 - 仅在开发环境
   */
  group: (label?: string) => {
    if (isDev) {
      console.group(label);
    }
  },

  /**
   * 分组结束 - 仅在开发环境
   */
  groupEnd: () => {
    if (isDev) {
      console.groupEnd();
    }
  },
};

// 导出别名，方便使用
export const log = logger.log;
export const logInfo = logger.info;
export const logDebug = logger.debug;
export const logWarn = logger.warn;
export const logError = logger.error;
