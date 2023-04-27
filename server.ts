// packages
import dotenv from 'dotenv';
import express from 'express';
import { OpenAI } from 'langchain/llms/openai';
import { loadQAChain } from 'langchain/chains';
import { Document } from 'langchain/document';
import multer from 'multer';
import next from 'next';
import fetch from 'node-fetch';
import puppeteer from 'puppeteer';

const dev = process.env.NODE_ENV !== 'production';
const port = 3000;
const server = next({ dev });
const handle = server.getRequestHandler();

// env
dotenv.config();

// form parsing
const upload = multer();

server
	.prepare()
	.then(() => {
		const app = express();

		app.use(express.json());
		app.use(upload.array('input'));

		app.get('*', (req, res) => handle(req, res));

		app.listen(port, () => {
			console.log(`> Ready on ${port}`);
		});

		app.post('/api/answer', async (req, res) => {
			const { website, question } = req.body;

			// validate the requested URL
			const websiteResponse = await fetch(website);
			if (!websiteResponse.ok) return res.status(404).json('Website not found');

			// instantiate puppeteer
			const browser = await puppeteer.launch({
				headless: 'new',
				ignoreHTTPSErrors: true,
			});
			const page = await browser.newPage();

			// process the page
			try {
				// instantiate the model
				const model = new OpenAI({
					openAIApiKey: process.env.OPENAI_API_KEY,
					temperature: 0.9,
					concurrency: 10,
					cache: true,
				});
				const chain = loadQAChain(model);

				// navigate to the page via Puppeteer
				await page.goto(website, { timeout: 180000 });

				// scrape the page 🕷️
				const text = await page.$eval('*', (el) => el.innerText);
				const filteredText = text.match(/(.+?\.)|(.+?\?)/g);
				const docs = filteredText.map(
					(pageContent) => new Document({ pageContent })
				);

				// close Puppeteer
				await browser.close();

				// evaluate the data
				const data = await chain.call({
					question,
					input_documents: docs,
				});

				res.send(data);
			} catch (error) {
				console.error('Error occurred handling', req.url);
				console.log(error);
				res.end('internal server error');
			}
		});
	})
	.catch((exception) => {
		console.log(exception.stack);
		process.exit(1);
	});
