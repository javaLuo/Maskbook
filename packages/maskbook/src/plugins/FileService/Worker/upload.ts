import type Transaction from 'arweave/web/lib/transaction'
import { instance, stage } from './stage'

// import { ServicesWithProgress } from 'src/extension/service.ts'
// ServicesWithProgress.pluginArweaveUpload

export async function* upload(id: Transaction['id']) {
    for await (const uploader of instance.transactions.upload(stage[id])) {
        yield uploader.pctComplete
    }
}
