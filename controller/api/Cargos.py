from flask import Blueprint, jsonify, request, render_template
from model.entities.Cargos import Cargo
from model.db import db

cargo_bp = Blueprint('cargo_bp', __name__)

# Ruta para obtener todos los cargos (activas e inactivas)
@cargo_bp.route('/all', methods=['GET'])
def get_all_cargos():
    cargos = Cargo.query.all()
    return jsonify([{
        "id": cargo.id_cargo,
        "nombre": cargo.nombre_cargo,
        "estado": cargo.estado
    } for cargo in cargos]), 200

# Ruta para obtener solo cargos activos
@cargo_bp.route('/', methods=['GET'])
def get_cargos():
    cargos = Cargo.query.filter_by(estado=True).all()  # Solo cargos activos
    return jsonify([{
        "id": cargo.id_cargo,
        "nombre": cargo.nombre_cargo
    } for cargo in cargos]), 200

# Ruta para crear un cargo
@cargo_bp.route('/', methods=['POST'])
def create_cargo():
    data = request.get_json()
    if not data or 'nombre_cargo' not in data:
        return jsonify({"error": "Datos inválidos"}), 400
    nuevo_cargo = Cargo(nombre_cargo=data['nombre_cargo'])
    db.session.add(nuevo_cargo)
    db.session.commit()
    return jsonify(nuevo_cargo.to_dict()), 201

# Ruta para actualizar un cargo
@cargo_bp.route('/<int:id_cargo>', methods=['PUT'])
def update_cargo(id_cargo):
    data = request.get_json()
    cargo = Cargo.query.get(id_cargo)
    if not cargo:
        return jsonify({"error": "Cargo no encontrado"}), 404
    cargo.nombre_cargo = data.get('nombre_cargo', cargo.nombre_cargo)
    cargo.estado = data.get('estado', cargo.estado)
    db.session.commit()
    return jsonify(cargo.to_dict()), 200

# Ruta para inactivar un cargo
@cargo_bp.route('/<int:id_cargo>', methods=['DELETE'])
def delete_cargo(id_cargo):
    cargo = Cargo.query.get(id_cargo)
    if not cargo:
        return jsonify({"error": "Cargo no encontrado"}), 404
    cargo.estado = False
    db.session.commit()
    return jsonify({"message": "Cargo inactivado"}), 200

# Ruta para reactivar un cargo
@cargo_bp.route('/<int:id_cargo>/reactivate', methods=['PUT'])
def reactivate_cargo(id_cargo):
    cargo = Cargo.query.get(id_cargo)
    if not cargo:
        return jsonify({"error": "Cargo no encontrado"}), 404
    cargo.estado = True
    db.session.commit()
    return jsonify({"message": "Cargo reactivado"}), 200

# Ruta para cargar la vista de cargos
@cargo_bp.route('/view', methods=['GET'])
def cargos_view():
    return render_template('welcome/home/forms/Cargos.html')
