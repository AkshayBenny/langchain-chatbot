'use client'

import { useState } from 'react'

export default function Home() {
	const [streamedData, setStreamedData] = useState('')

	const submitHandler = async (e: React.FormEvent) => {
		e.preventDefault()
		const formData = new FormData(e.currentTarget)
		console.log(formData.get('prompt'))
	}

	const handleClearChat = () => {
		setStreamedData('')
	}

	return (
		<main className='max-w-6xl mx-auto  min-h-screen w-screen flex flex-col items-center justify-start px-6'>
			<h1 className='text-white text-4xl font-bold text-center py-12'>
				Langchain Chatbot
			</h1>

			<form
				onSubmit={submitHandler}
				className='w-full flex flex-col items-start justify-center'>
				<textarea
					name='prompt'
					required
					placeholder='What do you want to know about?'
					className='px-4 py-2 border-white rounded-md placeholder:text-blue-400 w-full'
				/>
				<div className='flex items-center justify-end gap-4 w-full'>
					<button
						type='button'
						onClick={handleClearChat}
						className=' border border-white text-white px-12 py-3 text-lg rounded-md mt-5'>
						Clear Chat
					</button>
					<button
						type='submit'
						className='border border-white bg-white text-blue-600 px-12 py-3 text-lg rounded-md mt-5'>
						Send Chat
					</button>
				</div>
			</form>
			{streamedData && (
				<div className='w-full mt-12 space-y-[12px]'>
					<h2 className='text-white font-bold text-3xl w-full '>
						AI Assistant
					</h2>
					<p className='bg-blue-700 text-white rounded-md py-4 px-3'>
						{streamedData}
					</p>
				</div>
			)}
		</main>
	)
}
