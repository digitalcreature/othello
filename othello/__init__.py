from flask import *
from redis import Redis

app = Flask("")
redis = Redis(host="redis")

app.secret_key = "super secret secret key"

from . import views
from . import state

state.start_game()
