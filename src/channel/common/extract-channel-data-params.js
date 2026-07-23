export const extractChannelDataParams = (channelDataParams = []) => {
	const dataFields = {};

	for (const row of channelDataParams) {
		dataFields[row.field] = row.value;
	}

	return dataFields;
};
