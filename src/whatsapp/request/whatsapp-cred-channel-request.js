import { object, string } from "zod";

export const WhatsappCredChannelRequest = object({
	channelId: string().nonempty("Channel ID is required"),
	whatsappCredId: string().nonempty("Whatsapp Credential ID is required"),
});
