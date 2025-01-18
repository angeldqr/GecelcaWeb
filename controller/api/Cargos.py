from flask import Blueprint, jsonify, request
from model.entities.Cargos import Cargo
from model.db import db

cargo_bp = Blueprint('cargo_bp', __name__)

@cargo_bp.route('/', methods=['GET'])
def get_cargos():
    cargos = Cargo.query.filter_by(estado=True).all()
    return jsonify([cargo.to_dict() for cargo in cargos]), 200

@cargo_bp.route('/all', methods=['GET'])
def get_all_cargos():
    cargos = Cargo.query.all()
    return jsonify([cargo.to_dict() for cargo in cargos]), 200

@cargo_bp.route('/', methods=['POST'])
def create_cargo():
    data = request.get_json()
    if not data or 'nombre_cargo' not in data:
        return jsonify({"error": "Datos inválidos"}), 400
    nuevo_cargo = Cargo(nombre_cargo=data['nombre_cargo'])
    db.session.add(nuevo_cargo)
    db.session.commit()
    return jsonify(nuevo_cargo.to_dict()), 201

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

@cargo_bp.route('/<int:id_cargo>', methods=['DELETE'])
def delete_cargo(id_cargo):
    cargo = Cargo.query.get(id_cargo)
    if not cargo:
        return jsonify({"error": "Cargo no encontrado"}), 404
    cargo.estado = False
    db.session.commit()
    return jsonify({"message": "Cargo inactivado"}), 200

@cargo_bp.route('/<int:id_cargo>/reactivate', methods=['PUT'])
def reactivate_cargo(id_cargo):
    cargo = Cargo.query.get(id_cargo)
    if not cargo:
        return jsonify({"error": "Cargo no encontrado"}), 404
    cargo.estado = True
    db.session.commit()
    return jsonify({"message": "Cargo reactivado"}), 200
