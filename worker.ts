import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './activities';
import * as fs from 'fs';

async function run() {
  const connection = await NativeConnection.connect({
    address: process.env.TEMPORAL_URL,
    tls: {
      clientCertPair: {
        crt: fs.readFileSync(`./.temporal/certs/snap-mobile.pem`),
        key: fs.readFileSync(`./.temporal/certs/snap-mobile.key`),
      },
    },
  });
  const worker = await Worker.create({
    connection,
    namespace: process.env.TEMPORAL_NAMESPACE,
    workflowsPath: require.resolve('./workflows'),
    activities,
    taskQueue: 'hello-world',
  });
  await worker.run();
}

run()