from flask import Flask, redirect, url_for, send_from_directory
from flask_migrate import Migrate
from backend.extensions import db
from flask_cors import CORS
from backend.routes import api_blueprint
from backend.config import Config
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from backend.models import User, Category, Subcategory, Product, ProductImage, Service, Inquiry  # Asegúrate de tener el modelo definido en models.py
from dotenv import load_dotenv
from sqlalchemy import text
from flask_jwt_extended import JWTManager
import os

# Cargar variables de entorno desde el archivo .env
load_dotenv()

def create_app():
    app = Flask(__name__, static_folder='dist', static_url_path='')  # Cambia a 'dist'

    # Set the secret key to sign the JWTs
    app.config['JWT_SECRET_KEY'] = 'secret_key'
    # Specify where the JWT token will be located (e.g., headers, cookies)
    app.config['JWT_TOKEN_LOCATION'] = ['headers']

    # Initialize the JWT manager
    jwt = JWTManager(app)


    app.config.from_object(Config)



    # Inicializar la base de datos
    db.init_app(app)


    migrate = Migrate(app, db)


    # Verificar la conexión a la base de datos
    with app.app_context():
        try:
            with db.session.begin():
                db.session.execute(text("SELECT 1"))  # Simple query para verificar la conexión
        except Exception as e:
            print(f"Error al conectar a la base de datos: {e}")

    # Habilitar CORS
    CORS(app)

    # Registrar las rutas de la API
    app.register_blueprint(api_blueprint, url_prefix='/api')

    # Configurar Flask-Admin
    admin = Admin(app, name='Admin Panel', template_mode='bootstrap3')
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Category, db.session)) 
    admin.add_view(ModelView(Subcategory, db.session)) 
    admin.add_view(ModelView(Product, db.session))  
    admin.add_view(ModelView(ProductImage, db.session)) 
    admin.add_view(ModelView(Service, db.session))
    admin.add_view(ModelView(Inquiry, db.session)) 


    # Ruta para el frontend
    @app.route('/')
    def serve_frontend():
        return send_from_directory(app.static_folder, 'index.html')
    
    @app.route('/favicon.ico')
    def favicon():
        return send_from_directory(app.static_folder, 'favicon.ico')

    # Ruta para servir otros archivos estáticos (CSS, JS, etc.)
    @app.route('/<path:path>')
    def send_static(path):
        return send_from_directory(app.static_folder, path)

    # Manejo de errores 404
    @app.errorhandler(404)
    def not_found(error):
        return send_from_directory(app.static_folder, 'index.html'), 404

    return app

if __name__ == '__main__':
    app = create_app()
    PORT = int(os.environ.get('PORT', 3001))
    debug_mode = os.environ.get('FLASK_DEBUG', '0') == '1'
    app.run(host='0.0.0.0', port=PORT, debug=debug_mode)  # Usar la variable de entorno para debug
