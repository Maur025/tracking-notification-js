CREATE TABLE `database_configurations` (
	`id` text PRIMARY KEY,
	`created_at` integer,
	`updated_at` integer,
	`host` text NOT NULL,
	`port` text NOT NULL,
	`database` text NOT NULL,
	`reference_id` text NOT NULL
);
