const {
	// Server environment variables
	APP_PORT = "8801",
	APP_STATIC_PUBLIC_PATH = "./public",
	WS_PORT = "8851",
	// Redis connection settings
	REDIS_HOST = "localhost",
	REDIS_PORT = "6379",
	// Websocket gateway as client
	WS_GATEWAY_HOST_PROCESSOR = "localhost",
	WS_GATEWAY_PORT_PROCESSOR = "7180",
	UUID = "some-uuid",
	// Cache Db sqlite
	DB_URL = "./database/tracking-notification.db",
	DB_CHECKPOINT_INTERVAL_MINUTES = 15,
	// Whatsapp Worker configuration
	WP_REMOVE_ON_COMPLETE = 1000,
	WP_REMOVE_ON_FAIL = 2500,
	WP_LIMITER_MAX = 1,
	WP_LIMITER_DURATION = 1000,
	WP_LIMITER_GROUP_KEY = "channelId",
	WP_CONCURRENCY = 10,
	// Whatsapp Queue configuration
	WP_QUEUE_ATTEMPTS = 6,
	WP_QUEUE_BACKOFF_DELAY = 10000,
	// Whatsapp Channel configuration
	WP_CH_DEFAULT_QUERY_TIMEOUT_MS = 60000,
	WP_CH_CONNECT_TIMEOUT_MS = 60000,
	WP_CH_KEEP_ALIVE_INTERVAL_MS = 30000,
	// Email Worker configuration
	EMAIL_REMOVE_ON_COMPLETE = 1000,
	EMAIL_REMOVE_ON_FAIL = 2000,
	EMAIL_LIMITER_MAX = 3,
	EMAIL_LIMITER_DURATION = 1000,
	EMAIL_LIMITER_GROUP_KEY = "channelId",
	EMAIL_CONCURRENCY = 15,
	// Email Queue configuration
	EMAIL_QUEUE_ATTEMPTS = 6,
	EMAIL_QUEUE_BACKOFF_DELAY = 10000,
} = process.env;

/**
 * @typedef {Object} Environments
 * Server environment variables
 * @property {number} APP_PORT
 * @property {string} APP_STATIC_PUBLIC_PATH
 * @property {number} WS_PORT
 * Redis connection settings
 * @property {string} REDIS_HOST
 * @property {number} REDIS_PORT
 * Websocket gateway as client
 * @property {string} WS_GATEWAY_HOST_PROCESSOR
 * @property {number} WS_GATEWAY_PORT_PROCESSOR
 * Cache Db sqlite
 * @property {string} DB_URL
 * @property {number} DB_CHECKPOINT_INTERVAL_MINUTES
 * Whatsapp Worker configuration
 * @property {number} WP_REMOVE_ON_COMPLETE
 * @property {number} WP_REMOVE_ON_FAIL
 * @property {number} WP_LIMITER_MAX
 * @property {number} WP_LIMITER_DURATION
 * @property {string} WP_LIMITER_GROUP_KEY
 * @property {number} WP_CONCURRENCY
 * Whatsapp Queue configuration
 * @property {number} WP_QUEUE_ATTEMPTS
 * @property {number} WP_QUEUE_BACKOFF_DELAY
 * Whatsapp Channel configuration
 * @property {number} WP_CH_DEFAULT_QUERY_TIMEOUT_MS
 * @property {number} WP_CH_CONNECT_TIMEOUT_MS
 * @property {number} WP_CH_KEEP_ALIVE_INTERVAL_MS
 * Email Worker configuration
 * @property {number} EMAIL_REMOVE_ON_COMPLETE
 * @property {number} EMAIL_REMOVE_ON_FAIL
 * @property {number} EMAIL_LIMITER_MAX
 * @property {number} EMAIL_LIMITER_DURATION
 * @property {string} EMAIL_LIMITER_GROUP_KEY
 * @property {number} EMAIL_CONCURRENCY
 * Email Queue configuration
 * @property {number} EMAIL_QUEUE_ATTEMPTS
 * @property {number} EMAIL_QUEUE_BACKOFF_DELAY
 */

/** @type {Environments} */
export const environments = {
	// Server environment variables
	APP_PORT: Number(APP_PORT),
	APP_STATIC_PUBLIC_PATH,
	WS_PORT: Number(WS_PORT),
	// Redis connection settings
	REDIS_HOST,
	REDIS_PORT: Number(REDIS_PORT),
	// Websocket gateway as client
	WS_GATEWAY_HOST_PROCESSOR,
	WS_GATEWAY_PORT_PROCESSOR: Number(WS_GATEWAY_PORT_PROCESSOR),
	UUID,
	// Cache Db sqlite
	DB_URL,
	DB_CHECKPOINT_INTERVAL_MINUTES: Number(DB_CHECKPOINT_INTERVAL_MINUTES),
	// Whatsapp Worker configuration
	WP_REMOVE_ON_COMPLETE: Number(WP_REMOVE_ON_COMPLETE),
	WP_REMOVE_ON_FAIL: Number(WP_REMOVE_ON_FAIL),
	WP_LIMITER_MAX: Number(WP_LIMITER_MAX),
	WP_LIMITER_DURATION: Number(WP_LIMITER_DURATION),
	WP_LIMITER_GROUP_KEY,
	WP_CONCURRENCY: Number(WP_CONCURRENCY),
	// Whatsapp Queue configuration
	WP_QUEUE_ATTEMPTS: Number(WP_QUEUE_ATTEMPTS),
	WP_QUEUE_BACKOFF_DELAY: Number(WP_QUEUE_BACKOFF_DELAY),
	// Whatsapp Channel configuration
	WP_CH_DEFAULT_QUERY_TIMEOUT_MS: Number(WP_CH_DEFAULT_QUERY_TIMEOUT_MS),
	WP_CH_CONNECT_TIMEOUT_MS: Number(WP_CH_CONNECT_TIMEOUT_MS),
	WP_CH_KEEP_ALIVE_INTERVAL_MS: Number(WP_CH_KEEP_ALIVE_INTERVAL_MS),
	// Email Worker configuration
	EMAIL_REMOVE_ON_COMPLETE: Number(EMAIL_REMOVE_ON_COMPLETE),
	EMAIL_REMOVE_ON_FAIL: Number(EMAIL_REMOVE_ON_FAIL),
	EMAIL_LIMITER_MAX: Number(EMAIL_LIMITER_MAX),
	EMAIL_LIMITER_DURATION: Number(EMAIL_LIMITER_DURATION),
	EMAIL_LIMITER_GROUP_KEY,
	EMAIL_CONCURRENCY: Number(EMAIL_CONCURRENCY),
	// Email Queue configuration
	EMAIL_QUEUE_ATTEMPTS: Number(EMAIL_QUEUE_ATTEMPTS),
	EMAIL_QUEUE_BACKOFF_DELAY: Number(EMAIL_QUEUE_BACKOFF_DELAY),
};
