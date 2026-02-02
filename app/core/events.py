# app/events.py
from pyee.asyncio import AsyncIOEventEmitter

# Ini adalah pusat event kita (seperti EventEmitter di NestJS)
ee = AsyncIOEventEmitter()

# Nama-nama event (Konstanta agar tidak typo)
ANALYSIS_STARTED = "analysis:started"