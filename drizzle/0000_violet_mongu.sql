CREATE TABLE `companies` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`name` text NOT NULL,
	`reference_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `channel_types` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`name` text NOT NULL,
	`code` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `channel_types_code_unique` ON `channel_types` (`code`);--> statement-breakpoint
CREATE TABLE `channels` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`name` text NOT NULL,
	`channel_type_id` text NOT NULL,
	`company_id` text NOT NULL,
	`reference_id` text NOT NULL,
	`host` text,
	`port` text,
	`username` text,
	`password` text,
	FOREIGN KEY (`channel_type_id`) REFERENCES `channel_types`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action
);
