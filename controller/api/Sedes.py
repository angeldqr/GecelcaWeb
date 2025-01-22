from flask import Blueprint, jsonify, request, render_template
from model.entities.Sedes import Sede
from model.db import db

sede_bp = Blueprint('sede_bp', __name__)

# Ruta para obtener todas las sedes (activas e inactivas)
@sede_bp.route('/all', methods=['GET'])
def get_all_sedes():
    sedes = Sede.query.all()
    return jsonify([{
        "id": sede.id_sede,
        "nombre": sede.nombre_sede,
        "estado": sede.estado
    } for sede in sedes]), 200

# Ruta para obtener solo sedes activas
@sede_bp.route('/', methods=['GET'])
def get_sedes():
    sedes = Sede.query.filter_by(estado=True).all()  # Solo sedes activas
    return jsonify([{
        "id": sede.id_sede,
        "nombre": sede.nombre_sede
    } for sede in sedes]), 200

# Ruta para crear una sede
@sede_bp.route('/', methods=['POST'])
def create_sede():
    data = request.get_json()
    if not data or 'nombre_sede' not in data:
        return jsonify({"error": "Datos inválidos"}), 400
    nueva_sede = Sede(nombre_sede=data['nombre_sede'])
    db.session.add(nueva_sede)
    db.session.commit()
    return jsonify(nueva_sede.to_dict()), 201

# Ruta para actualizar una sede
@sede_bp.route('/<int:id_sede>', methods=['PUT'])
def update_sede(id_sede):
    data = request.get_json()
    sede = Sede.query.get(id_sede)
    if not sede:
        return jsonify({"error": "Sede no encontrada"}), 404
    sede.nombre_sede = data.get('nombre_sede', sede.nombre_sede)
    sede.estado = data.get('estado', sede.estado)
    db.session.commit()
    return jsonify(sede.to_dict()), 200

# Ruta para inactivar una sede
@sede_bp.route('/<int:id_sede>', methods=['DELETE'])
def delete_sede(id_sede):
    sede = Sede.query.get(id_sede)
    if not sede:
        return jsonify({"error": "Sede no encontrada"}), 404
    sede.estado = False
    db.session.commit()
    return jsonify({"message": "Sede inactivada"}), 200

# Ruta para reactivar una sede
@sede_bp.route('/<int:id_sede>/reactivate', methods=['PUT'])
def reactivate_sede(id_sede):
    sede = Sede.query.get(id_sede)
    if not sede:
        return jsonify({"error": "Sede no encontrada"}), 404
    sede.estado = True
    db.session.commit()
    return jsonify({"message": "Sede reactivada"}), 200

# Ruta para cargar la vista de sedes
@sede_bp.route('/view', methods=['GET'])
def sedes_view():
    return render_template('welcome/home/forms/Sedes.html')
