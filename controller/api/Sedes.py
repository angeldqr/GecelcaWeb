from flask import Blueprint, jsonify, request
from model.entities.Sedes import Sede
from model.entities.Empresas import Empresa
from model.db import db

sede_bp = Blueprint('sede_bp', __name__)

@sede_bp.route('/', methods=['GET'])
def get_sedes():
    sedes = Sede.query.filter_by(estado=True).all()
    return jsonify([sede.to_dict() for sede in sedes]), 200

@sede_bp.route('/all', methods=['GET'])
def get_all_sedes():
    sedes = Sede.query.all()
    return jsonify([sede.to_dict() for sede in sedes]), 200

@sede_bp.route('/', methods=['POST'])
def create_sede():
    data = request.get_json()
    if not data or 'nombre_sede' not in data or 'id_empresa' not in data:
        return jsonify({"error": "Datos inválidos"}), 400

    empresa = Empresa.query.get(data['id_empresa'])
    if not empresa:
        return jsonify({"error": "La empresa especificada no existe"}), 404

    nueva_sede = Sede(nombre_sede=data['nombre_sede'], id_empresa=data['id_empresa'])
    db.session.add(nueva_sede)
    db.session.commit()
    return jsonify(nueva_sede.to_dict()), 201

@sede_bp.route('/<int:id_sede>', methods=['PUT'])
def update_sede(id_sede):
    data = request.get_json()
    sede = Sede.query.get(id_sede)
    if not sede:
        return jsonify({"error": "Sede no encontrada"}), 404

    sede.nombre_sede = data.get('nombre_sede', sede.nombre_sede)
    if 'id_empresa' in data:
        empresa = Empresa.query.get(data['id_empresa'])
        if not empresa:
            return jsonify({"error": "La empresa especificada no existe"}), 404
        sede.id_empresa = data['id_empresa']

    sede.estado = data.get('estado', sede.estado)
    db.session.commit()
    return jsonify(sede.to_dict()), 200

@sede_bp.route('/<int:id_sede>', methods=['DELETE'])
def delete_sede(id_sede):
    sede = Sede.query.get(id_sede)
    if not sede:
        return jsonify({"error": "Sede no encontrada"}), 404
    sede.estado = False
    db.session.commit()
    return jsonify({"message": "Sede inactivada"}), 200

@sede_bp.route('/<int:id_sede>/reactivate', methods=['PUT'])
def reactivate_sede(id_sede):
    sede = Sede.query.get(id_sede)
    if not sede:
        return jsonify({"error": "Sede no encontrada"}), 404
    sede.estado = True
    db.session.commit()
    return jsonify({"message": "Sede reactivada"}), 200
