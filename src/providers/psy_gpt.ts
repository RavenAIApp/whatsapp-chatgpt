import config from "../config";

/**
 * @param text The sentence to be converted to speech
 * @returns Audio buffer
 */
async function psyGPTRequest(text: string): Promise<String | null> {
	const url = config.psyGPTServerUrl + "/psy";

	// Request options
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			text
		})
	};

	try {
		const response = await fetch(url, options);
		return response;
	} catch (error) {
		console.error("An error occured (PSY GPT request)", error);
		return null;
	}
}

export { psyGPTRequest };
