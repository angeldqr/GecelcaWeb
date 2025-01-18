from flask import Blueprint, jsonify, request, render_template
from model.entities.Area import Area
from model.db import db

area_bp = Blueprint('area_bp', __name__)

@area_bp.route('/', methods=['GET'])
def get_areas():
    areas = Area.query.all()
    return jsonify([area.to_dict() for area in areas]), 200

@area_bp.route('/', methods=['POST'])
def create_area():
    data = request.get_json()
    if not data or 'nombre_area' not in data:
        return jsonify({"error": "Datos inválidos"}), 400
    nueva_area = Area(nombre_area=data['nombre_area'])
    db.session.add(nueva_area)
    db.session.commit()
    return jsonify(nueva_area.to_dict()), 201

# Ruta para actualizar un área
@area_bp.route('/<int:id_area>', methods=['PUT'])
def update_area(id_area):
    data = request.get_json()
    area = Area.query.get(id_area)
    if not area:
        return jsonify({"error": "Área no encontrada"}), 404
    area.nombre_area = data.get('nombre_area', area.nombre_area)
    area.estado = data.get('estado', area.estado)  # Actualizar estado si está en los datos
    db.session.commit()
    return jsonify(area.to_dict()), 200

# Ruta para inactivar un área (soft delete)
@area_bp.route('/<int:id_area>', methods=['DELETE'])
def inactivate_area(id_area):
    area = Area.query.get(id_area)
    if not area:
        return jsonify({"error": "Área no encontrada"}), 404
    area.estado = False  # Cambiar estado a inactivo
    db.session.commit()
    return jsonify({"message": "Área inactivada"}), 200

# Ruta para cargar la vista de áreas
@area_bp.route('/view', methods=['GET'])
def areas_view():
    return render_template('welcome/home/forms/Areas.html')
