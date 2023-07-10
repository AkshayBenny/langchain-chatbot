import { ChatOpenAI } from 'langchain/chat_models/openai'
import { HumanMessage, SystemMessage } from 'langchain/schema'

const runnLLMChain = async (prompt: any) => {
	const encoder = new TextEncoder()
	const stream = new TransformStream()
	const writer = stream.writable.getWriter()

	const model = new ChatOpenAI({
		streaming: true,
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

	model.call([new HumanMessage(prompt)])

	return stream.readable
}
export async function POST(req: any) {
	const { prompt } = await req.json()

	const stream = runnLLMChain(prompt)
	return new Response(await stream)
}
