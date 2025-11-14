import sys, os
from serverless_fastapi import Handler

# add backend folder to path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from backend.src import app

handler = Handler(app)