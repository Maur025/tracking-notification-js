import { getObjectOfString } from "./get-object-of-string.js";
import { getSafeJsonStrToParse } from "./get-safe-json-str-to-parse.js";

export const getChannelData = (channelDataResponse) => {
	const safeDataStr = getSafeJsonStrToParse(channelDataResponse);

	const channelData = getObjectOfString(safeDataStr);

	if (!channelData) {
		return undefined;
	}

	return {
		params: channelData.params?.map((param) => ({ ...param })),
		userParams: channelData.userparams
			? channelData.userparams?.map((userParam) => ({ ...userParam }))
			: [],
	};
};
