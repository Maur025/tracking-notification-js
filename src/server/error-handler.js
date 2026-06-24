import { ZodError } from "zod";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export class ErrorHandler {
	// eslint-disable-next-line no-unused-vars
	handler(err, req, res, next) {
		const zodError = this.zodErrorHandler({ err, res });
		if (zodError) return zodError;

		const authError = this.authorizationErrorHandler({ err, res });
		if (authError) return authError;

		console.error(err);

		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json({
				code: StatusCodes.INTERNAL_SERVER_ERROR,
				message: ReasonPhrases.INTERNAL_SERVER_ERROR,
			});
	}

	zodErrorHandler({ err, res }) {
		if (!(err instanceof ZodError)) {
			return null;
		}

		return res.status(StatusCodes.BAD_REQUEST).json({
			code: StatusCodes.BAD_REQUEST,
			message: ReasonPhrases.BAD_REQUEST,
			errors: err.format(),
		});
	}

	authorizationErrorHandler({ err, res }) {
		if (err.name !== "UnauthorizedError") {
			return null;
		}

		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({ code: StatusCodes.UNAUTHORIZED, message: ReasonPhrases.UNAUTHORIZED });
	}
}
