import { ChatOpenAI } from 'langchain/chat_models/openai'
import { HumanMessage, SystemMessage } from 'langchain/schema'

const systemMessage =
	'As an expert in coaching UPSC CSE candidates, you possess extensive knowledge in elucidating concepts and generating highly accurate and succinct summaries on various topics. Your objective is to extract information related to what the user is asking for   and compose a step-by-step summary based on your expertise. Feel free to seek further clarification regarding what the user wanted to know by asking questions. However, please note that you have a limited allocation of 1 attempts, and providing an incorrect answer will result in a penalty, reducing the only attempt you have.'

const runnLLMChain = async (prompt: any) => {
	const encoder = new TextEncoder()
	const stream = new TransformStream()
	const writer = stream.writable.getWriter()

	const model = new ChatOpenAI({
		streaming: true,
		modelName: 'gpt-3.5-turbo',
		callbacks: [
			{
				async handleLLMNewToken(token: string) {
					await writer.ready
					await writer.write(encoder.encode(`${token}`))
				},
				async handleLLMEnd() {
					await writer.ready
					await writer.close()
				},
			},
		],
	})

	model.call([new SystemMessage(systemMessage), new HumanMessage(prompt)])

	return stream.readable
}
export async function POST(req: any) {
	const { prompt } = await req.json()

	const stream = runnLLMChain(prompt)
	return new Response(await stream)
}
