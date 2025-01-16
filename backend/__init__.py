
from flask import Flask
from backend.extensions import db  # Asegúrate de que esto apunte a la extensión correcta

def create_app():
    app = Flask(__name__)
    app.config.from_object('backend.config')  # Ajusta según tu archivo de configuración
    db.init_app(app)  # Inicializa la base de datos con la app

    # Aquí puedes registrar blueprints, etc.
    
    return app
