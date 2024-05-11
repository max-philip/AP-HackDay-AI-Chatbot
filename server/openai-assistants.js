const OpenAI = require("openai");
const {sleep} = require("openai/core");

const assistant_id = "";			// TODO: NEED ASSISTANT ID
const openai = new OpenAI({apiKey: ""});		// TODO: API KEY HERE

async function createThread() {
    const newThread = await openai.beta.threads.create();
    console.log(newThread);
    return newThread;
}

async function deleteThread(data) {
    const res = await openai.beta.threads.del(data.id);
    console.log(res);
    return res;
}

async function chatWithOpenAiAssistant(req) {
    // Add message to thread
    const message = await openai.beta.threads.messages.create(
        req.thread.id,
        {
            role: "user",
            content: req.input
        }
    );
    return do_run(req.thread.id);
}

async function do_run(thread_id) {
    // Create a run
    const run = await openai.beta.threads.runs.create(
        thread_id,
        {
            assistant_id: assistant_id
        }
    );
    // Poll run
    let run_poll;
    let try_count = 1;
    do {
        // if (try_count > 50) {
        //   throw Error();
        // }
        // console.log(`trying ${try_count}`)

        run_poll = await openai.beta.threads.runs.retrieve(
            thread_id,
            run.id
        );
        try_count++;
        if (run_poll.status === "failed" || run_poll.status === "cancelled" || run_poll.status === "cancelling" || run_poll.status === "expired") {
            const fail_message = await openai.beta.threads.messages.create(
                thread_id,
                {
                    role: "assistant",
                    content: "I'm sorry, something went wrong trying to process your last message."
                }
            );
        }
        if (run_poll.status === "completed") {
            break;
        }
        await sleep(100);
    } while (run_poll.status !== "completed");

    return openai.beta.threads.messages.list(
        thread_id
    );
}

module.exports =  {createThread, deleteThread, chatWithOpenAiAssistant};