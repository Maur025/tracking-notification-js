import { array, object, string } from "zod";

export const EmailAddQueueRequest = object({
	message: string().nonempty("Message is required"),
	subject: string().nonempty("Subject is required"),
	toList: array(string().nonempty("Email address is required")).nonempty("To list is required"),
	channelIds: array(string().nonempty("channelId is required")).nonempty(
		"Channel IDs are required",
	),
	companyId: string().nonempty("Company ID is required"),
});
