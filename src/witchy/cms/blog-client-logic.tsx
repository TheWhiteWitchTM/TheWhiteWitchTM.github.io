/// In your client script (useEffect part)
/// src/witchy/cms/BlogClientLogic.tsx
'use client'

import { useEffect } from 'react'

export default function BlogClientLogic() {
	useEffect(() => {
		// Give React hydration a moment to finish
		const timer = setTimeout(() => {
			const wrappers = document.querySelectorAll('[data-content-wrapper]')

			wrappers.forEach((wrapperEl) => {
				const wrapper = wrapperEl as HTMLElement
				const slug = wrapper.id.replace('content-wrapper-', '')
				const buttonContainer = document.getElementById(`expand-btn-${slug}`)
				const fade = document.getElementById(`fade-${slug}`)

				if (!wrapper || !buttonContainer) return

				// Check if content overflows the cap
				const overflowing = wrapper.scrollHeight > wrapper.clientHeight + 10

				if (overflowing && buttonContainer) {
					// Create button
					buttonContainer.innerHTML = `
            <button 
              class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all hover:scale-105 shadow-sm"
              aria-label="Toggle read more"
              data-toggle
            >
              ↓
            </button>
          `
					buttonContainer.classList.remove('hidden')

					// Attach click handler
					const btn = buttonContainer.querySelector('button')
					if (btn) {
						btn.addEventListener('click', () => {
							const isCollapsed = wrapper.classList.contains('max-h-[200px]')

							if (isCollapsed) {
								wrapper.classList.remove('max-h-[200px]', 'overflow-hidden')
								if (fade) fade.classList.add('hidden')
								btn.innerHTML = '↑'
								btn.setAttribute('aria-label', 'Show less')
							} else {
								wrapper.classList.add('max-h-[200px]', 'overflow-hidden')
								if (fade) fade.classList.remove('hidden')
								btn.innerHTML = '↓'
								btn.setAttribute('aria-label', 'Read more')
							}
						})
					}
				}
			})
		}, 150) // 150ms delay — safe for most cases

		return () => clearTimeout(timer)
	}, [])

	return null
}