import { StatusCodes, getReasonPhrase } from "http-status-codes";

export const serverResponse = ({ code, data = null, message = null }) => {
	const statusCode = code || StatusCodes.OK;
	const reasonPhrase = getReasonPhrase(statusCode).toUpperCase();
	const messageStatus = reasonPhrase === "OK" ? "SUCCESS" : reasonPhrase;

	const response = {
		code: statusCode,
		message: messageStatus,
	};

	if (data) {
		response.data = data;
	}

	if (message) {
		response.detail = message;
	}

	return response;
};
