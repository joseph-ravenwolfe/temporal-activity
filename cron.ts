import { nanoid } from 'nanoid'
import Temporal from './temporal';
import { example } from './workflows';

const CRON_NAME = 'my-cron';

(async function() {
  try {
    const client = await Temporal.createClient();
    console.log(`Running Cron: ${CRON_NAME}`);
    const workflow = await client.workflow.start(example, {
      taskQueue: 'hello-world',
      workflowId: CRON_NAME,
      cronSchedule: '* * * * *',
      args: ['Temporal Cron'],
    });
    await workflow.result();
  } catch(e) {
    if (e instanceof Temporal.alreadyStartedError) {
      const client = await Temporal.createClient();
      await Temporal.cancelCron(client, CRON_NAME)
    }
  }
}());

// STOP CRON JOB ON CTRL+C
process.on('SIGINT', async () => {
  const client = await Temporal.createClient();
  await Temporal.cancelCron(client, CRON_NAME)
  console.log(`\nCanceled Cron: ${CRON_NAME}`);
  process.exit(0);
});