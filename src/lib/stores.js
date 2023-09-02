import { writable } from 'svelte/store';

export const redirectStore = writable(false);

export const walletState = writable(null);

export const signRequest = writable({
  messageToSign: {},
  signature: null,
  drawer: false
});

export const googleSession = writable({
  activeSession: false
});