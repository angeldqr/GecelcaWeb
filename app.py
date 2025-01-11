from flask import Flask
from model.db import db  # Importamos db desde model

# Inicialización de la app
app = Flask(__name__)
app.secret_key = 'tu_clave_secreta_aqui'

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:0219@localhost/Gecelca"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar la base de datos con la app
db.init_app(app)

# Registrar los Blueprints después de inicializar la app
def register_blueprints(app):
    from controller.api.Area import area_bp
    from controller.api.Cargos import cargo_bp
    from controller.api.Empresas import empresa_bp
    from controller.api.Sedes import sede_bp
    from controller.api.Empleados import empleado_bp

    app.register_blueprint(area_bp, url_prefix='/areas')
    app.register_blueprint(cargo_bp, url_prefix='/cargos')
    app.register_blueprint(empresa_bp, url_prefix='/empresas')
    app.register_blueprint(sede_bp, url_prefix='/sedes')
    app.register_blueprint(empleado_bp, url_prefix='/empleados')

with app.app_context():
    db.create_all()  # Crear todas las tablas configuradas en los modelos
    register_blueprints(app)  # Registrar los Blueprints

# Rutas base para vistas
@app.route('/')
def home():
    return "Bienvenido a la API Flask", 200

if __name__ == '__main__':
    app.run(debug=True)
