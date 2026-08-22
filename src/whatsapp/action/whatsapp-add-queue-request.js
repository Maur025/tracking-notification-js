import { array, enum as enum_, object, string } from "zod";

export const whatsappAddQueueRequest = object({
	message: string().nonempty("Message is required").optional(),
	toList: array(string().nonempty("Phone number is required")).nonempty("To list is required"),
	channelIds: array(string().nonempty("channelId is required")).nonempty(
		"Channel IDs are required",
	),
	type: enum_(["DOCUMENT", "VIDEO", "IMAGE", "TEXT"]).optional().default("TEXT"),
	url: string().optional(),
	mimetype: string().optional(),
	fileName: string().optional(),
});
