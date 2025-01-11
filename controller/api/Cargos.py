from flask import Blueprint, jsonify, request
from model.entities.Cargos import Cargo
from model.db import db

cargo_bp = Blueprint('cargo_bp', __name__)

# Ruta para obtener todos los cargos
@cargo_bp.route('/', methods=['GET'])
def get_cargos():
    cargos = Cargo.query.all()
    return jsonify([cargo.to_dict() for cargo in cargos]), 200

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
    db.session.commit()
    return jsonify(cargo.to_dict()), 200

# Ruta para eliminar un cargo
@cargo_bp.route('/<int:id_cargo>', methods=['DELETE'])
def delete_cargo(id_cargo):
    cargo = Cargo.query.get(id_cargo)
    if not cargo:
        return jsonify({"error": "Cargo no encontrado"}), 404
    db.session.delete(cargo)
    db.session.commit()
    return jsonify({"message": "Cargo eliminado"}), 200
