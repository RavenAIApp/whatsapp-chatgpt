import os from "os";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { Message, MessageMedia } from "whatsapp-web.js";
import { Document } from "langchain/document";
import { llm_conversation, llm_summary_chain, llm_docs, llm_prompt} from "../providers/llmai";
import * as cli from "../cli/ui";
import config from "../config";
import { ttsRequest } from "../providers/speech";

// Mapping from number to last conversation id
const conversations = {};

const handleMessageLLM = async (message: Message, prompt: string) => {
	try {

		cli.print(`[LLM] Received prompt from ${message.from}: ${prompt}`);

		const start = Date.now();

        let opt = {
			input: llm_prompt.concat(prompt),
	    }	

		let response: string;
		response = await llm_conversation.predict(opt);
		/*
        for (const generation of res.generations) {
			for (const g of generation) {
				cli.print(`[LLM] debug to ${message.from}: ${g.text}`);
				response += g.text;
    		}
		}
		*/
		const end = Date.now() - start;
		cli.print(`[LLM] Answer to ${message.from}: ${response}`);

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

const handleMessageLLMSummary= async (message: Message, prompt: string) => {
	try {

		cli.print(`[LLM] Received prompt from ${message.from}: ${prompt}`);
		const start = Date.now();
        let opt = {
			input_documents: llm_docs,
			question: "Summary",
	    }	
		let response: string;
		const result = await llm_summary_chain.call(opt);
        const keys = Object.keys(result);
		if (keys.length === 1) {
			response = result[keys[0]];
		}
		const end = Date.now() - start;
		cli.print(`[LLM Summary] Received result key length ${keys.length}`);
		cli.print(`[LLM Summary] Answer to ${message.from}: ${response}`);

		// Default: Text reply
		message.reply(response);

        //clear the docs
		llm_docs.length = 0;
		cli.print(`[LLM Summary] docs length ${llm_docs.length}`);

	} catch (error: any) {
		console.error("An error occured", error);
		message.reply("An error occured, please contact the administrator. (" + error.message + ")");
	}
};

const handleMessageLLMDocs = async (message: Message) => {
	try {

		cli.print(`[LLM] Received msg from ${message.from}: ${message.body}`);
		llm_docs.push(new Document({ pageContent: message.body}));

	} catch (error: any) {
		console.error("An error occured", error);
		message.reply("An error occured, please contact the administrator. (" + error.message + ")");
	}
};

export { handleMessageLLM, handleMessageLLMSummary, handleMessageLLMDocs };
