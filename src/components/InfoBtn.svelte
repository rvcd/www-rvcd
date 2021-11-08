<script>
	import { fly, fade } from 'svelte/transition';
	export let info = {};
	const {title, description, url, location_url, image_url} = info;

	let isOpen = false;


</script>

<button class="opacity-50 hover:opacity-80" on:click={() => isOpen = !isOpen}>
	<svg class="fill-current text-white" xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24" width="30px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
</button>

{#if isOpen}
	<div class="fixed top-0 left-0 w-full h-screen bg-gray-900 bg-opacity-90 z-40" transition:fade="{{duration: 100}}">
		<div class="stack h-full">
			<img src={image_url} class="sm:h-full w-full place-self-center self-center object-contain max-w-6xl" alt={title}/>
			<button on:click={() => isOpen = false} class="place-self-end opacity-50 hover:opacity-80 absolute top-5 right-5">
				<svg class="fill-current text-white" xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24" width="30px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>			
			</button>
			<div class="place-self-end bg-gradient-to-t from-black w-full">
				<div class="main w-full flex justify-between items-center">
					<div class="text-gray-300">
						<h2 class="text-xl">{title}</h2>
						<p class="text-lg"
							>{description}</p>
						<a class="underline" href={url}>» more info</a>
					</div>
					<div>
						<a href={location_url} class="opacity-20 hover:opacity-80">
							<svg class="fill-current text-gray-300" xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24" width="30px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>
						</a>
						<p class="text-gray-300">map</p>
					</div>

				</div>
			</div>
		</div>
	</div>
{/if}
