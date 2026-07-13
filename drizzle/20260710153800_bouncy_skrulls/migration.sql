CREATE TABLE `channel_assign_wp_creds` (
	`id` text PRIMARY KEY,
	`created_at` integer,
	`updated_at` integer,
	`channel_id` text NOT NULL,
	`whatsapp_cred_id` text NOT NULL,
	CONSTRAINT `fk_channel_assign_wp_creds_channel_id_channels_id_fk` FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_channel_assign_wp_creds_whatsapp_cred_id_whatsapp_creds_id_fk` FOREIGN KEY (`whatsapp_cred_id`) REFERENCES `whatsapp_creds`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `whatsapp_creds` (
	`id` text PRIMARY KEY,
	`created_at` integer,
	`updated_at` integer,
	`creds_json` text NOT NULL,
	`phone_number_identifier` text UNIQUE
);
--> statement-breakpoint
CREATE TABLE `whatsapp_keys` (
	`id` text PRIMARY KEY,
	`created_at` integer,
	`updated_at` integer,
	`key_type` text,
	`key_id` text,
	`value_json` text,
	`cred_id` text NOT NULL,
	CONSTRAINT `fk_whatsapp_keys_cred_id_whatsapp_creds_id_fk` FOREIGN KEY (`cred_id`) REFERENCES `whatsapp_creds`(`id`) ON DELETE CASCADE
);
