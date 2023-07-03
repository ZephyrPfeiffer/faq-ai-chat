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
import { get_encoding, encoding_for_model } from '@dqbd/tiktoken';

// to do's
/*
  enforce a token size limit for all requests being sent to ai 
  update footer/social section (add structure and socials)
*/

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

		app.listen(process.env.PORT || port, () => {
			console.log(`> Ready on ${port}`);
		});

		app.post('/api/answer', async (req, res) => {
			const { website, question } = req.body;

			// validate the requested URL
      try {

        const websiteResponse = await fetch(website);
        if (!websiteResponse.ok) return res.status(404).json('Website not found');

      }catch(error) {
        return res.status(404).json('Website not found');
      }

			// instantiate puppeteer
			const browser = await puppeteer.launch({
				headless: 'new',
        ignoreHTTPSErrors: true,
        args: ['--no-sandbox']
			});

			const page = await browser.newPage();

			// process the page
			try {

				// navigate to the page via Puppeteer
				await page
					.goto(website, {
						waitUntil: 'domcontentloaded',
					})
					.catch((error) => console.log(error));

				// scrape the page 🕷️
				// @ts-ignore
				const text = await page.$eval('*', (el) => el.innerText);
				const filteredText = text.match(/(.+?\.)|(.+?\?)/g);

        // reduce size of filtered text to be under token limit (if above token limit) for ai being used
        const encoding = encoding_for_model("text-davinci-003");
        const tokenLimit = 3700;
        let tokenSum = 0;
        let validDocuments = [];

        for(let i = 0; i < filteredText.length; i++) {

          tokenSum += Number(encoding.encode(filteredText[i]).length);

          if(tokenSum > tokenLimit) {
            break;
          }

          validDocuments.push(filteredText[i]);

        }

        // const tokens = encoding.encode(filteredText.join(''))
        // console.log(tokens.length)
				const docs = validDocuments.map(
					(pageContent) => new Document({ pageContent })
				);

				// // close Puppeteer
				await browser.close();

				// // instantiate the model (model: text-davinci-003)
				const model = new OpenAI({
					openAIApiKey: process.env.OPENAI_API_KEY,
					temperature: 0.9,
					concurrency: 10,
					cache: true,
				});

				const chain = loadQAChain(model);

				// // evaluate the data
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
