'use client'

import { useState } from 'react'

const spinner = (
	<div role='status'>
		<svg
			aria-hidden='true'
			className='w-8 h-8 mr-2 text-gray-200 animate-spin fill-blue-400'
			viewBox='0 0 100 101'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'>
			<path
				d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
				fill='currentColor'
			/>
			<path
				d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
				fill='currentFill'
			/>
		</svg>
		<span className='sr-only'>Loading...</span>
	</div>
)

export default function Home() {
	const [streamedData, setStreamedData] = useState('')
	const [loading, setLoading] = useState(false)

	const submitHandler = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		const formData = new FormData(e.currentTarget)
		const response = await fetch('/api/langchain', {
			method: 'POST',
			body: JSON.stringify({ prompt: formData.get('prompt') }),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		})
		const reader = response?.body?.getReader()

		while (true) {
			if (!reader) break
			const { done, value } = await reader.read()
			if (done) break
			const text = new TextDecoder().decode(value)
			setStreamedData((prev) => prev + text)
		}
		setLoading(false)
	}

	const handleClearChat = () => {
		setStreamedData('')
	}

	return (
		<main className='max-w-6xl mx-auto  min-h-screen overflow-x-clip max-w-screen flex flex-col items-center justify-start p-6'>
			<h1 className='text-white text-4xl font-bold text-center py-12'>
				Langchain Chatbot
			</h1>

			<form
				onSubmit={submitHandler}
				className='w-full flex flex-col items-start justify-center'>
				<textarea
					name='prompt'
					required
					placeholder='What do you wish to know about?'
					className='px-4 py-2 border-white rounded-md placeholder:text-blue-600 w-full'
				/>
				<div className='flex flex-col lg:flex-row items-center justify-end gap-2 w-full mt-5'>
					<button
						type='button'
						disabled={loading}
						onClick={handleClearChat}
						className='w-full border border-white text-white px-12 py-3 text-lg rounded-md lg:mt-5'>
						{loading ? spinner : 'Clear chat'}
					</button>
					<button
						type='submit'
						disabled={loading}
						className='w-full border border-white bg-white text-blue-600 px-12 py-3 text-lg rounded-md lg:mt-5'>
						{loading ? spinner : 'Chat now'}
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
