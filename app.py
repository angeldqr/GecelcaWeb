from flask import Flask, render_template
from flask_cors import CORS
import psycopg2
from model.db import db

app = Flask(__name__, template_folder='templates')

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:0219@localhost/Gecelca"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
CORS(app)

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

with app.app_context():
    db.create_all()
    register_blueprints(app)

@app.route('/')
def dashboard():
    return render_template('welcome/Dashboard.html')

if __name__ == '__main__':
    app.run(debug=True)
