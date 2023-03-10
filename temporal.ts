import { Connection, Client, WorkflowExecutionAlreadyStartedError } from '@temporalio/client';
import { NativeConnection, Worker } from '@temporalio/worker';
import * as fs from 'fs';

async function createWorker({ workflowsPath, activities, taskQueue }) {
  const connection = await NativeConnection.connect({
    address: process.env.TEMPORAL_URL,
    tls: {
      clientCertPair: {
        crt: fs.readFileSync(`./.temporal/certs/snap-mobile.pem`),
        key: fs.readFileSync(`./.temporal/certs/snap-mobile.key`),
      },
    },
  });
  return await Worker.create({
    connection,
    namespace: process.env.TEMPORAL_NAMESPACE,
    workflowsPath,
    activities,
    taskQueue,
  });
}

async function createClient() {
  const connection = await Connection.connect({
    address: process.env.TEMPORAL_URL,
    tls: {
      clientCertPair: {
        crt: fs.readFileSync(`./.temporal/certs/snap-mobile.pem`),
        key: fs.readFileSync(`./.temporal/certs/snap-mobile.key`),
      },
    },
  });
  return new Client({
    connection,
    namespace: process.env.TEMPORAL_NAMESPACE
  });
}

async function cancelCron(client, workflowId) {
  const workflow = client.workflow.getHandle(workflowId);
  await workflow.cancel();
}

const alreadyStartedError = WorkflowExecutionAlreadyStartedError;

export default { createWorker, createClient, cancelCron, alreadyStartedError }