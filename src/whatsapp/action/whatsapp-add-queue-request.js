import { array, object, string } from "zod";

export const whatsappAddQueueRequest = object({
	message: string().nonempty("Message is required"),
	toList: array(string().nonempty("Phone number is required")).nonempty("To list is required"),
	channelIds: array(string().nonempty("channelId is required")).nonempty(
		"Channel IDs are required",
	),
});
