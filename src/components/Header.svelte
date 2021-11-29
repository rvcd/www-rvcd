<script>
	import { fly } from 'svelte/transition';
	import { clickOutside } from '../lib/clickOutside.js';

	let menuOpen = false;
	let y = 0;
	let fixHeader = false;

	function handleScroll(event) {
		menuOpen = false;
		const newY = event.target.scrollingElement.scrollTop;
		fixHeader = newY < y && y !== 0;
		y = newY;
	}
</script>

{#key fixHeader}
	<div class="w-full" style="height: 80px;">
		<div class="w-full bg-white z-20 shadow-lg top-0" class:fixed={fixHeader} in:fly="{{ y: -100, duration: 400}}" >
			<div class="relative max-w-6xl mx-auto">
				<div class="flex justify-between items-center px-6 py-4 lg:justify-start lg:space-x-10 ">
					<div class="flex justify-start lg:w-0 lg:flex-1">
						<a href="/">
							<span class="sr-only">Home</span>
							<img 
								class="h-12 w-auto"
								width="96"
								height="96" 
								src="https://ik.imagekit.io/thegoldendino/rvcd/brand/logo-submark-2_o9JQAlsAv.png?updatedAt=1636004430482&tr=w-96,h-96" 
								alt="RVCD">
						</a>
					</div>
					<div class="-mr-2 -my-2 lg:hidden">
						<button on:click={() => menuOpen = !menuOpen} type="button" class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none" aria-expanded="false">
							<span class="sr-only">Open menu</span>
							<!-- Heroicon name: outline/menu -->
							<svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>
					</div>
					<nav class="hidden lg:flex space-x-10">
						<a href="/community" class="tracking-widest text-lg font-base text-gray-700 hover:text-gray-900">
							COMMUNITY
						</a>
						<a href="/events" class="tracking-widest text-lg font-base text-gray-700 hover:text-gray-900">
							EVENTS	
						</a>
						<a href="/involved" class="tracking-widest text-lg font-base text-gray-700 hover:text-gray-900">
							GET&nbsp;INVOLVED
						</a>
						<a href="/press" class="tracking-widest text-lg font-base text-gray-700 hover:text-gray-900">
							PRESS
						</a>
						<a href="/about" class="tracking-widest text-lg font-base text-gray-700 hover:text-gray-900">
							ABOUT
						</a>
					</nav>
					<div class="hidden lg:flex items-center justify-end lg:flex-1 lg:w-0">
						<a href="/donate" class="tracking-widest ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-lg font-base text-white bg-wine">
							♥ DONATE 
						</a>
					</div>
				</div>

				<!--
					Mobile menu, show/hide based on mobile menu state.

					Entering: "duration-200 ease-out"
						From: "opacity-0 scale-95"
						To: "opacity-100 scale-100"
					Leaving: "duration-100 ease-in"
						From: "opacity-100 scale-100"
						To: "opacity-0 scale-95"
				-->
				{#if menuOpen}
					<div class="absolute top-0 inset-x-0 p-2 z-20"  use:clickOutside on:click-outside={() => menuOpen = false} transition:fly="{{ y: -100, duration: 200}}">
						<div class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
							<div class="py-6 px-5">
								<div class="grid grid-cols-2 gap-4">
									<a href="/community" class="tracking-widest text-lg font-base text-gray-500 hover:text-cobalt">
										COMMUNITY
									</a>
									<a href="/events" class="tracking-widest text-lg font-base text-gray-500 hover:text-cobalt">
										EVENTS
									</a>
									<a href="/involved" class="tracking-widest text-lg font-base text-gray-500 hover:text-cobalt">
										GET&nbsp;INVOLVED
									</a>
									<a href="/press" class="tracking-widest text-lg font-base text-gray-500 hover:text-cobalt">
										PRESS
									</a>
									<a href="/about" class="tracking-widest text-lg font-base text-gray-500 hover:text-cobalt">
										ABOUT
									</a>
									<div>
										<a href="/donate" class="tracking-widest whitespace-nowrap inline-flex items-center justify-center px-4 py-2 mr-4 border border-transparent rounded-md shadow-sm text-lg font-base text-white bg-wine w-auto">
											♥ DONATE 
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/if} 
			</div> 
		</div>
	</div>
{/key}

<svelte:window on:scroll={handleScroll} />