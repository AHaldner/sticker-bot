import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const client = new Client({
	puppeteer: {
		headless: true,
	},
	ffmpegPath: '/usr/local/bin/ffmpeg',
	authStrategy: new LocalAuth(),
});

client.on('ready', () => {
	console.log('Client is ready!');
});

client.on('qr', (qr) => {
	qrcode.generate(qr, { small: true });
});

client.on('message_create', async (message) => {
	if (message.body.startsWith('!sticker')) {
		const url = message.body.replace('!sticker', '').trim();

		try {
			const sticker = await MessageMedia.fromUrl(url);
			client.sendMessage(message.from, sticker, {
				sendMediaAsSticker: true,
			});
		} catch (error) {
			console.error('Error creating sticker:', error);
			client.sendMessage(
				message.from,
				'Failed to create sticker. Please check your URL.'
			);
		}
	}
});

client.initialize();
