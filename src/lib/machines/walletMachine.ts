// src/lib/machines/walletMachine.ts
import { createMachine, assign } from 'xstate';
import { signInWithGoogle } from '../services/signInWithGoogle';
import { createSession } from '../services/createSession';

const walletMachine = createMachine({
    id: 'wallet',
    initial: 'signIn',
    context: {
        provider: null,
        providerName: null,
        authMethod: null,
        pkps: [],
        sessionSigs: null
    },
    states: {
        signIn: {
            on: {
                RELOAD: {
                    target: 'sessionAvailable',
                    actions: assign({
                        pkps: (_, event) => event.pkps,
                        sessionSigs: (_, event) => event.sessionSigs,
                    }),
                },
            },
            invoke: {
                src: 'signInWithGoogle',
                onDone: {
                    target: 'authenticated',
                    actions: assign({
                        providerName: (_, event) => event.data.providerName,
                        provider: (_, event) => event.data.provider,
                        authMethod: (_, event) => event.data.authMethod,
                    }),
                },
            },
        },
        authenticated: {
            invoke: {
                src: async (context) => {
                    const pkps = await context.provider.fetchPKPsThroughRelayer(context.authMethod);
                    if (pkps.length === 0) {
                        const newPKP = await context.provider.mintPKP(context.authMethod);
                        pkps.push(newPKP);
                    }
                    return pkps;
                },
                onDone: {
                    target: 'creatingSession',
                    actions: assign({
                        pkps: (_, event) => event.data,
                    }),
                },
                onError: 'authenticated',
            },
        },
        creatingSession: {
            invoke: {
                src: async (context) => {
                    const { pkps, sessionSigs } = await createSession(context.provider, context.authMethod, context.pkps);
                    return { pkps, sessionSigs };
                },
                onDone: {
                    target: 'sessionAvailable',
                    actions: [
                        assign({
                            pkps: (_, event) => event.data.pkps,
                            sessionSigs: (_, event) => event.data.sessionSigs,
                        }),
                        (context) => console.log('Context after creating session:', context), // Debug log
                    ],
                },
                onError: {
                    target: 'sessionExpired',
                    actions: assign({
                        error: (_, event) => event.data,
                    }),
                },
            },
        },
        sessionAvailable: {
            on: {
                EXPIRED: {
                    target: 'sessionExpired',
                    cond: (context) => context.sessionSigs === null
                }
            }
        },
        sessionExpired: {}
    },
}, {
    services: {
        signInWithGoogle,
        createSession
    },
});

export default walletMachine;
