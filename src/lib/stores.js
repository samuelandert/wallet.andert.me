import { writable } from 'svelte/store';

export const redirectStore = writable(false);

export const walletState = writable(null);

export const messageToSign = writable(null);

export const messageSignature = writable(null);

export const googleSession = writable({
    activeSession: false
  });