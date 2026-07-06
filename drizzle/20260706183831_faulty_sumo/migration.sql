CREATE TABLE `channel_types` (
	`id` text PRIMARY KEY,
	`created_at` integer,
	`updated_at` integer,
	`name` text NOT NULL,
	`code` text NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE `channels` (
	`id` text PRIMARY KEY,
	`created_at` integer,
	`updated_at` integer,
	`name` text NOT NULL,
	`channel_type_id` text NOT NULL,
	`company_id` text,
	`reference_id` text NOT NULL,
	`host` text,
	`port` integer,
	`username` text,
	`password` text,
	`secure` integer DEFAULT false,
	CONSTRAINT `fk_channels_channel_type_id_channel_types_id_fk` FOREIGN KEY (`channel_type_id`) REFERENCES `channel_types`(`id`),
	CONSTRAINT `fk_channels_company_id_companies_id_fk` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`)
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` text PRIMARY KEY,
	`created_at` integer,
	`updated_at` integer,
	`name` text NOT NULL,
	`reference_id` text NOT NULL
);
