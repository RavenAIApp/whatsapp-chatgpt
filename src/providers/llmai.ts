import { OpenAI } from "langchain";
import { BufferMemory } from "langchain/memory";
import { PromptTemplate } from "langchain/prompts";
import { Document } from "langchain/document";
import { ConversationChain, loadSummarizationChain } from "langchain/chains";
import config from "../config";

let openai_opt = {
	temperature: 0.7, // OpenAI parameter
	max_tokens: config.maxModelTokens, // OpenAI parameter [Max response size by tokens]
	top_p: 0.9, // OpenAI parameter
	frequency_penalty: 0, // OpenAI parameter
	presence_penalty: 0, // OpenAI parameter
	// instructions: ``,
	modelName: "gpt-3.5-turbo", // OpenAI parameter  `gpt-3.5-turbo` is PAID
	openAIApiKey: config.openAIAPIKey,
};

export const llm_ai = new OpenAI(openai_opt);

export const llm_memory = new BufferMemory();

export const llm_prompt = "I want you to act as a mental health adviser. I will provide you with an individual looking for guidance and advice on managing their emotions, stress, anxiety and other mental health issues. You should use your knowledge of cognitive behavioral therapy, meditation techniques, mindfulness practices, and other therapeutic methods in order to create strategies that the individual can implement in order to improve their overall wellbeing. My first request is: "

const cvsc_opt = {
    llm: llm_ai,
    memory: llm_memory,
};

export const llm_conversation = new ConversationChain(cvsc_opt);


//summary
export const llm_docs: Document[] = [];

const template = `Write a concise summary of the following:
"{text}"
CONCISE SUMMARY IN THE FORM OF A LIST:`;

const SUMMARY_PROMPT = new PromptTemplate({
    template: template,
    inputVariables: ["text"],
});

const summary_params = {
	prompt: SUMMARY_PROMPT,
};

export const llm_summary_chain = loadSummarizationChain(new OpenAI({modelName: "text-ada-001"}), summary_params);
