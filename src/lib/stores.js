import { writable } from 'svelte/store';

export const signRequest = writable({json: {}});

export const signedMessages = writable([])

export const redirectStore = writable(false);

export const googleSession = writable({
    activeSession: false
  });