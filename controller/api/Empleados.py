from flask import Blueprint, jsonify, request, render_template
from model.entities.Empleados import Empleado
from model.db import db

empleado_bp = Blueprint('empleado_bp', __name__)

# Ruta para obtener todos los empleados (activos e inactivos)
@empleado_bp.route('/all', methods=['GET'])
def get_all_empleados():
    try:
        empleados = Empleado.query.all()
        print("Empleados cargados desde la base de datos:", empleados)  # Verifica los datos
        return jsonify([empleado.to_dict() for empleado in empleados]), 200
    except Exception as e:
        print("Error al obtener empleados:", e)  # Log del error
        return jsonify({"error": "No se pudieron cargar los empleados"}), 500

# Ruta para obtener solo empleados activos
@empleado_bp.route('/', methods=['GET'])
def get_empleados():
    empleados = Empleado.query.filter_by(estado=True).all()
    return jsonify([empleado.to_dict() for empleado in empleados]), 200

# Ruta para crear un empleado
@empleado_bp.route('/', methods=['POST'])
def create_empleado():
    data = request.get_json()
    print("Datos recibidos del frontend:", data)

    required_fields = [
        'primer_nombre', 'primer_apellido', 'correo_electronico', 'id_cargo',
        'id_sede', 'id_empresa', 'id_area',
        'fecha_nacimiento', 'fecha_ingreso'
    ]
    if not data or any(field not in data for field in required_fields):
        print("Faltan campos obligatorios o son inválidos")
        return jsonify({"error": "Datos inválidos o incompletos"}), 400

    try:
        nuevo_empleado = Empleado(
            primer_nombre=data['primer_nombre'],
            segundo_nombre=data.get('segundo_nombre'),
            primer_apellido=data['primer_apellido'],
            segundo_apellido=data.get('segundo_apellido'),
            correo_electronico=data['correo_electronico'],  # Nuevo campo
            id_cargo=data['id_cargo'],
            id_sede=data['id_sede'],
            id_empresa=data['id_empresa'],
            id_area=data['id_area'],
            fecha_nacimiento=data['fecha_nacimiento'],
            fecha_ingreso=data['fecha_ingreso']
        )
        db.session.add(nuevo_empleado)
        db.session.commit()
        return jsonify(nuevo_empleado.to_dict()), 201
    except Exception as e:
        print("Error al insertar el empleado:", e)
        return jsonify({"error": "No se pudo insertar el empleado"}), 500

# Ruta para actualizar un empleado
@empleado_bp.route('/<int:id_empleado>', methods=['PUT'])
def update_empleado(id_empleado):
    data = request.get_json()
    empleado = Empleado.query.get(id_empleado)
    if not empleado:
        return jsonify({"error": "Empleado no encontrado"}), 404

    empleado.primer_nombre = data.get('primer_nombre', empleado.primer_nombre)
    empleado.segundo_nombre = data.get('segundo_nombre', empleado.segundo_nombre)
    empleado.primer_apellido = data.get('primer_apellido', empleado.primer_apellido)
    empleado.segundo_apellido = data.get('segundo_apellido', empleado.segundo_apellido)
    empleado.correo_electronico = data.get('correo_electronico', empleado.correo_electronico)  # Nuevo campo
    empleado.id_cargo = data.get('id_cargo', empleado.id_cargo)
    empleado.id_sede = data.get('id_sede', empleado.id_sede)
    empleado.id_empresa = data.get('id_empresa', empleado.id_empresa)
    empleado.id_area = data.get('id_area', empleado.id_area)
    empleado.fecha_nacimiento = data.get('fecha_nacimiento', empleado.fecha_nacimiento)
    empleado.fecha_ingreso = data.get('fecha_ingreso', empleado.fecha_ingreso)
    empleado.estado = data.get('estado', empleado.estado)
    db.session.commit()
    return jsonify(empleado.to_dict()), 200

# Ruta para inactivar un empleado
@empleado_bp.route('/<int:id_empleado>', methods=['DELETE'])
def delete_empleado(id_empleado):
    empleado = Empleado.query.get(id_empleado)
    if not empleado:
        return jsonify({"error": "Empleado no encontrado"}), 404
    empleado.estado = False
    db.session.commit()
    return jsonify({"message": "Empleado inactivado"}), 200

# Ruta para reactivar un empleado
@empleado_bp.route('/<int:id_empleado>/reactivate', methods=['PUT'])
def reactivate_empleado(id_empleado):
    empleado = Empleado.query.get(id_empleado)
    if not empleado:
        return jsonify({"error": "Empleado no encontrado"}), 404
    empleado.estado = True
    db.session.commit()
    return jsonify({"message": "Empleado reactivado"}), 200

# Ruta para cargar la vista de empleados
@empleado_bp.route('/view', methods=['GET'])
def empleados_view():
    return render_template('welcome/home/forms/Empleados.html')
