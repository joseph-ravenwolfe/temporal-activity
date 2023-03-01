import { Connection, Client } from '@temporalio/client';
import { example } from './workflows';
import { nanoid } from 'nanoid';
import * as fs from 'fs';

async function run() {
  const connection = await Connection.connect({
    address: process.env.TEMPORAL_URL,
    tls: {
      clientCertPair: {
        crt: fs.readFileSync(`./.temporal/certs/snap-mobile.pem`),
        key: fs.readFileSync(`./.temporal/certs/snap-mobile.key`),
      },
    },
  });

  const client = new Client({
    connection,
    namespace: process.env.TEMPORAL_NAMESPACE
  });

  const handle = await client.workflow.start(example, { args: ['Temporal'], taskQueue: 'hello-world', workflowId: 'workflow-' + nanoid(), });
  console.log(`Started workflow ${handle.workflowId}`);
  console.log(await handle.result()); // Hello, Temporal!
}

run();