// packages
import dotenv from 'dotenv';
import express from 'express';
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import multer from 'multer';
import next from 'next';
import fetch from 'node-fetch';
import puppeteer from 'puppeteer';
import { get_encoding, encoding_for_model } from '@dqbd/tiktoken';

// to do's
/*
  enforce a token size limit for all requests being sent to ai
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
        if(websiteResponse.status === 403) return res.status(403).json('Website not accessible');
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
        const encoding = encoding_for_model("gpt-3.5-turbo");
        const tokenLimit = 15000;
        let tokenSum = 0;
        let validDocuments = [];

        for(let i = 0; i < filteredText.length; i++) {

          tokenSum += Number(encoding.encode(filteredText[i]).length);

          if(tokenSum > tokenLimit) {
            break;
          }

          validDocuments.push(filteredText[i]);

        }

        const context = filteredText.join('');

				// // close Puppeteer
				await browser.close();

				// // instantiate the model
				const model = new ChatOpenAI({
					openAIApiKey: process.env.OPENAI_API_KEY,
          modelName: "gpt-3.5-turbo",
					temperature: 0.9,
					cache: true,
				});

        const promptTemplate = PromptTemplate.fromTemplate(
          "Use the following pieces of context provided from a website to answer a question about the website at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer. Context: {context} Question: {question}"
        )

        const outputParser = new StringOutputParser();

        const chain = RunnableSequence.from([promptTemplate, model, outputParser]);

				// // Create a request to open ai and retrieve response data
				const data = await chain.invoke({
          context: context,
          question: question,
        })

				res.json(data);
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
