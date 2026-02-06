from pyee.asyncio import AsyncIOEventEmitter

ee = AsyncIOEventEmitter()

ANALYSIS_STARTED = "analysis:started"
ANALYSIS__BATCH_STARTED = "analysis:started-batch"
SEND_EMAIL = "activation.email"