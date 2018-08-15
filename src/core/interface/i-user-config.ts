/**
 * (alias) the item of config.middleware
 */

// export type IUserConfigMiddlewareOpts = string | ConfigMiddlewareItemModel;

/**
 * Logger config
 */
export default {};

export interface ILoggerConfig {
  directory?: string;
  level?: string;
  stdout?: boolean;
}
