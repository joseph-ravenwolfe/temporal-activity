import Temporal from './temporal'
import * as activities from './activities';

(async function() {

  const worker = await Temporal.createWorker({
    workflowsPath: require.resolve('./workflows'),
    activities,
    taskQueue: 'hello-world'
  });
  await worker.run();

}());