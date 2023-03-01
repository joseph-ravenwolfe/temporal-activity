import { nanoid } from 'nanoid'
import Temporal from './temporal';
import { example } from './workflows';

(async function() {
  const client = await Temporal.createClient();
  const workflow = await client.workflow.start(example, { args: ['Temporal'], taskQueue: 'hello-world', workflowId: `workflow-snap-${nanoid()}` });
  console.log(`Started workflow ${workflow.workflowId}`);
  console.log(await workflow.result());
}());