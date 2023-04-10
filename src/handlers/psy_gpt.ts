import os from "os";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { Message, MessageMedia } from "whatsapp-web.js";
import * as cli from "../cli/ui";
import config from "../config";
import { psyGPTRequest } from "../providers/psy_gpt";

// Mapping from number to last conversation id
const conversations = {};

const handleMessagePsyGPT = async (message: Message, prompt: string) => {
	try {

		cli.print(`[PsyGPT] Received prompt from ${message.from}: ${prompt}`);

		let response: string;
		response = await psyGPTRequest(opt);

		cli.print(`[PsyGPT] Answer to ${message.from}: ${response}`);

		// TTS reply (Default: disabled)
		if (config.ttsEnabled) {
			sendVoiceMessageReply(message, response);
			return;
		}

		// Default: Text reply
		message.reply(response);
	} catch (error: any) {
		console.error("An error occured", error);
		message.reply("An error occured, please contact the administrator. (" + error.message + ")");
	}
};

export { handleMessagePsyGPT };
