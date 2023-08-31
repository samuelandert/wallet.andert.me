import { writable } from 'svelte/store';

export const signRequest = writable({json: {}});

export const signedMessages = writable([])