import Arweave from 'arweave/web'
import type Transaction from 'arweave/web/lib/transaction'

export const stage: Record<Transaction['id'], Transaction> = {}

export const instance = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
})
