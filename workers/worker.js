/* eslint-disable global-require */
import amqplib from 'amqplib';
import exportTask from './exportTask';
import importTask from './importTask';
import { WorkerTask } from '../server/models';

if (process.env.NODE_ENV !== 'production') {
	require('../server/config.js');
}

const processTask = (channel)=> {
	return (msg)=> {
		const taskData = JSON.parse(msg.content.toString());

		/* Specify which task function to run based on the type as set in the msg */
		let taskFunction;
		if (taskData.type === 'export') {
			taskFunction = exportTask(taskData.pubId, taskData.versionId, taskData.content, taskData.format);
		} else if (taskData.type === 'import') {
			taskFunction = importTask(taskData.sourceUrl);
			// taskFunction = importTask('https://assets.pubpub.org/ywh5c35b/61529509039692.docx');
		} else {
			taskFunction = new Promise((resolve, reject)=> {
				reject(new Error('Invalid Task Type'));
			});
		}

		/* Set the variable for updatedWorkerTaskData */
		/* We will update this data depending on whether */
		/* the task succeeds or fails, and have a single */
		/* request to update the database WorkerTask row. */
		let updatedWorkerTaskData;

		/* Run the task as determined by the msg type */
		return taskFunction
		.then((taskOutput)=> {
			/* On success, set the taskOutput to output */
			updatedWorkerTaskData = {
				isProcessing: false,
				error: null,
				output: taskOutput,
			};
		})
		.catch((taskErr)=> {
			/* On failure, set the taskError to error */
			updatedWorkerTaskData = {
				isProcessing: false,
				error: taskErr.message ? taskErr.message : taskErr,
				output: null,
			};
		})
		.finally(()=> {
			/* On either success or failure, update */
			/* the WorkTask database row with the  */
			/* result of the function and ack the queue msg */
			return WorkerTask.update(updatedWorkerTaskData, {
				where: { id: taskData.id }
			})
			.then(()=> {
				console.log('Finished task ', taskData.id);
				channel.ack(msg);
			});
		});
	};
};

/* Initialize the connection to the queue and set */
/* the processTask function to run on new msgs */
amqplib.connect(process.env.CLOUDAMQP_URL).then((conn)=> {
	process.once('SIGINT', ()=> { conn.close(); });
	return conn.createConfirmChannel().then((ch)=> {
		let ok = ch.assertQueue('pubpubTaskQueue', { durable: true });
		ok = ok.then(()=> { ch.prefetch(1); });
		ok = ok.then(()=> {
			ch.consume('pubpubTaskQueue', processTask(ch), { noAck: false });
			console.log(' [*] Waiting for messages. To exit press CTRL+C');
		});
		return ok;
	});
})
.catch(console.warn);
