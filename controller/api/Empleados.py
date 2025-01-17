from flask import Blueprint, jsonify, request
from model.entities.Empleados import Empleado
from model.entities.Cargos import Cargo
from model.entities.Sedes import Sede
from model.entities.Empresas import Empresa
from model.db import db

empleado_bp = Blueprint('empleado_bp', __name__)

# Ruta para obtener todos los empleados
@empleado_bp.route('/', methods=['GET'])
def get_empleados():
    empleados = Empleado.query.all()
    return jsonify([empleado.to_dict() for empleado in empleados]), 200

# Ruta para crear un empleado
@empleado_bp.route('/', methods=['POST'])
def create_empleado():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Datos inválidos"}), 400

    # Validaciones
    if not Cargo.query.get(data.get('id_cargo')):
        return jsonify({"error": "El cargo especificado no existe"}), 404
    if not Sede.query.get(data.get('id_sede')):
        return jsonify({"error": "La sede especificada no existe"}), 404
    if not Empresa.query.get(data.get('id_empresa')):
        return jsonify({"error": "La empresa especificada no existe"}), 404

    nuevo_empleado = Empleado(
        primer_nombre=data['primer_nombre'],
        segundo_nombre=data.get('segundo_nombre'),
        primer_apellido=data['primer_apellido'],
        segundo_apellido=data.get('segundo_apellido'),
        id_cargo=data['id_cargo'],
        id_sede=data['id_sede'],
        id_empresa=data['id_empresa'],
        fecha_nacimiento=data['fecha_nacimiento'],
        fecha_ingreso=data['fecha_ingreso'],
        password=data['password']  # Nuevo campo
    )
    db.session.add(nuevo_empleado)
    db.session.commit()
    return jsonify(nuevo_empleado.to_dict()), 201

# Ruta para actualizar un empleado
@empleado_bp.route('/<int:id_empleado>', methods=['PUT'])
def update_empleado(id_empleado):
    data = request.get_json()
    empleado = Empleado.query.get(id_empleado)
    if not empleado:
        return jsonify({"error": "Empleado no encontrado"}), 404

    # Actualizar los campos
    empleado.primer_nombre = data.get('primer_nombre', empleado.primer_nombre)
    empleado.segundo_nombre = data.get('segundo_nombre', empleado.segundo_nombre)
    empleado.primer_apellido = data.get('primer_apellido', empleado.primer_apellido)
    empleado.segundo_apellido = data.get('segundo_apellido', empleado.segundo_apellido)
    empleado.password = data.get('password', empleado.password)  # Nuevo campo

    if 'id_cargo' in data and not Cargo.query.get(data['id_cargo']):
        return jsonify({"error": "El cargo especificado no existe"}), 404
    if 'id_sede' in data and not Sede.query.get(data['id_sede']):
        return jsonify({"error": "La sede especificada no existe"}), 404
    if 'id_empresa' in data and not Empresa.query.get(data['id_empresa']):
        return jsonify({"error": "La empresa especificada no existe"}), 404

    empleado.id_cargo = data.get('id_cargo', empleado.id_cargo)
    empleado.id_sede = data.get('id_sede', empleado.id_sede)
    empleado.id_empresa = data.get('id_empresa', empleado.id_empresa)
    empleado.fecha_nacimiento = data.get('fecha_nacimiento', empleado.fecha_nacimiento)
    empleado.fecha_ingreso = data.get('fecha_ingreso', empleado.fecha_ingreso)
    empleado.activo = data.get('activo', empleado.activo)

    db.session.commit()
    return jsonify(empleado.to_dict()), 200

# Ruta para eliminar un empleado (inactivarlo)
@empleado_bp.route('/<int:id_empleado>', methods=['DELETE'])
def delete_empleado(id_empleado):
    empleado = Empleado.query.get(id_empleado)
    if not empleado:
        return jsonify({"error": "Empleado no encontrado"}), 404
    empleado.activo = False
    db.session.commit()
    return jsonify({"message": "Empleado inactivado"}), 200
