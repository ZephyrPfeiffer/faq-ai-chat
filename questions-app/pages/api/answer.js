
/// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { OpenAI } from "langchain/llms";
import { loadQAChain } from "langchain/chains";
import { Document } from "langchain/document";
import * as cheerio from 'cheerio'
import axios from 'axios'

export default async function handler(req, res) {
  try {
    const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.9, concurrency: 10, cache: true });
    const body = JSON.parse(req.body)

    const websiteResponse = await fetch(body.website)

    if(websiteResponse.ok) {
      const website = await axios.get(body.website)
      const html = website.data;
      const chain = loadQAChain(model);

      const $ = cheerio.load(html, { ignoreWhitespace: true, scriptingEnabled: false });

      $('script').remove()

      const text = $('body').text();
      const filteredText = text.match(/(.+?\.)|(.+?\?)/g);
      const docs = filteredText.map(sentence => new Document({ pageContent: sentence }))

      res.json(await chain.call({ question: body.question, input_documents: docs }))
    }else {
      res.status(404).json('Website not found')
    }
      
  } catch (error) {
    res.json(error)
  }

}

