from flask import Blueprint, jsonify, request, render_template
from model.entities.Empresas import Empresa
from model.db import db

empresa_bp = Blueprint('empresa_bp', __name__)

# Ruta para obtener todas las empresas (activas e inactivas)
@empresa_bp.route('/all', methods=['GET'])
def get_all_empresas():
    empresas = Empresa.query.all()
    return jsonify([{
        "id": empresa.id_empresa,
        "nombre": empresa.nombre_empresa,
        "estado": empresa.estado
    } for empresa in empresas]), 200

# Ruta para obtener solo empresas activas
@empresa_bp.route('/', methods=['GET'])
def get_empresas():
    empresas = Empresa.query.filter_by(estado=True).all()  # Solo empresas activas
    return jsonify([{
        "id": empresa.id_empresa,
        "nombre": empresa.nombre_empresa
    } for empresa in empresas]), 200

# Ruta para crear una empresa
@empresa_bp.route('/', methods=['POST'])
def create_empresa():
    data = request.get_json()
    if not data or 'nombre_empresa' not in data:
        return jsonify({"error": "Datos inválidos"}), 400
    nueva_empresa = Empresa(nombre_empresa=data['nombre_empresa'])
    db.session.add(nueva_empresa)
    db.session.commit()
    return jsonify(nueva_empresa.to_dict()), 201

# Ruta para actualizar una empresa
@empresa_bp.route('/<int:id_empresa>', methods=['PUT'])
def update_empresa(id_empresa):
    data = request.get_json()
    empresa = Empresa.query.get(id_empresa)
    if not empresa:
        return jsonify({"error": "Empresa no encontrada"}), 404
    empresa.nombre_empresa = data.get('nombre_empresa', empresa.nombre_empresa)
    empresa.estado = data.get('estado', empresa.estado)
    db.session.commit()
    return jsonify(empresa.to_dict()), 200

# Ruta para inactivar una empresa
@empresa_bp.route('/<int:id_empresa>', methods=['DELETE'])
def delete_empresa(id_empresa):
    empresa = Empresa.query.get(id_empresa)
    if not empresa:
        return jsonify({"error": "Empresa no encontrada"}), 404
    empresa.estado = False
    db.session.commit()
    return jsonify({"message": "Empresa inactivada"}), 200

# Ruta para reactivar una empresa
@empresa_bp.route('/<int:id_empresa>/reactivate', methods=['PUT'])
def reactivate_empresa(id_empresa):
    empresa = Empresa.query.get(id_empresa)
    if not empresa:
        return jsonify({"error": "Empresa no encontrada"}), 404
    empresa.estado = True
    db.session.commit()
    return jsonify({"message": "Empresa reactivada"}), 200

# Ruta para cargar la vista de empresas
@empresa_bp.route('/view', methods=['GET'])
def empresas_view():
    return render_template('welcome/home/forms/Empresas.html')
