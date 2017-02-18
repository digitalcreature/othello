import app as production

production.socketio.run(production.app, host = "0.0.0.0")
