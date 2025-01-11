from flask import Blueprint, jsonify, request
from model.entities.Empresas import Empresa
from model.db import db

empresa_bp = Blueprint('empresa_bp', __name__)

# Ruta para obtener todas las empresas
@empresa_bp.route('/', methods=['GET'])
def get_empresas():
    empresas = Empresa.query.all()
    return jsonify([empresa.to_dict() for empresa in empresas]), 200

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
    db.session.commit()
    return jsonify(empresa.to_dict()), 200

# Ruta para eliminar una empresa
@empresa_bp.route('/<int:id_empresa>', methods=['DELETE'])
def delete_empresa(id_empresa):
    empresa = Empresa.query.get(id_empresa)
    if not empresa:
        return jsonify({"error": "Empresa no encontrada"}), 404
    db.session.delete(empresa)
    db.session.commit()
    return jsonify({"message": "Empresa eliminada"}), 200
