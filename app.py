from flask import Flask, render_template
from flask_cors import CORS
import psycopg2
from model.db import db

# Inicializar la aplicación Flask
app = Flask(__name__, template_folder='templates')

# Configuración de la base de datos PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:0219@localhost/Gecelca"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar SQLAlchemy
db.init_app(app)

# Habilitar CORS para evitar problemas de acceso entre frontend y backend
CORS(app)

# Registrar Blueprints de la API
def register_blueprints(app):
    from controller.api.Area import area_bp
    from controller.api.Cargos import cargo_bp
    from controller.api.Empresas import empresa_bp
    from controller.api.Sedes import sede_bp
    from controller.api.Empleados import empleado_bp

    app.register_blueprint(area_bp, url_prefix='/api/areas')
    app.register_blueprint(cargo_bp, url_prefix='/api/cargos')
    app.register_blueprint(empresa_bp, url_prefix='/api/empresas')
    app.register_blueprint(sede_bp, url_prefix='/api/sedes')
    app.register_blueprint(empleado_bp, url_prefix='/api/empleados')

# Crear las tablas en la base de datos si no existen
with app.app_context():
    db.create_all()
    register_blueprints(app)

# Ruta para renderizar el Dashboard principal
@app.route('/')
def dashboard():
    return render_template('welcome/Dashboard.html')

# Ruta para servir los archivos HTML de los módulos
@app.route('/modules/<module_name>')
def get_module(module_name):
    return render_template(f'welcome/home/forms/{module_name}.html')

# Ejecutar la aplicación en modo depuración
if __name__ == '__main__':
    app.run(debug=True)
