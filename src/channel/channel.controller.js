import { StatusCodes } from "http-status-codes";
import { serverResponse } from "../server/server-response.js";

export class ChannelController {
	#channelService;
	#resource = "channels";

	/**
	 *
	 * @param {object} request
	 * @param {import('./channel.service.js').ChannelService} request.channelService
	 */
	constructor({ channelService }) {
		this.#channelService = channelService;
	}

	/** @param {import('express').Application} app*/
	registerRoutes(app) {
		app.get(`/${this.#resource}`, (req, res) => this.#handleGetChannels(req, res));
	}

	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async #handleGetChannels(req, res) {
		const { page = 0, size = 10, sortBy = "id", descending = false } = req.params;
		const channels = await this.#channelService.findAllWithPagination({
			page,
			size,
			sortBy,
			descending,
		});

		return res.status(StatusCodes.OK).json(
			serverResponse({
				code: StatusCodes.OK,
				data: channels.data,
				pagination: { pages: channels.totalPages, count: channels.totalElements },
			}),
		);
	}
}
