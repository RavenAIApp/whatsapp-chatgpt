import { GroupNotification, Message } from "whatsapp-web.js";
import * as cli from "../cli/ui";

// Handles groupnotification
async function handleIncomingGroupNotification(gnfn: GroupNotification) {

	cli.print(`[Handler] Received GoupNotification`);

	// get joined group chat
	const groupChat = await gnfn.getChat();

	// get msgs from the group chat
	const msgs = await groupChat.fetchMessages();

	cli.print(`[Handler] Received GoupNotification msgs: ${msgs.length}`);
}

export { handleIncomingGroupNotification };
