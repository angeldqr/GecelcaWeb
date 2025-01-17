from model.db import db
from model.entities.Cargos import Cargo
from model.entities.Sedes import Sede
from model.entities.Empresas import Empresa

class Empleado(db.Model):
    __tablename__ = 'empleados'
    id_empleado = db.Column(db.Integer, primary_key=True)
    primer_nombre = db.Column(db.String(50), nullable=False)
    segundo_nombre = db.Column(db.String(50))
    primer_apellido = db.Column(db.String(50), nullable=False)
    segundo_apellido = db.Column(db.String(50))
    id_cargo = db.Column(db.Integer, db.ForeignKey('cargos.id_cargo', ondelete="SET NULL"), nullable=False)
    id_sede = db.Column(db.Integer, db.ForeignKey('sedes.id_sede', ondelete="CASCADE"), nullable=False)
    id_empresa = db.Column(db.Integer, db.ForeignKey('empresas.id_empresa', ondelete="CASCADE"), nullable=False)
    fecha_nacimiento = db.Column(db.Date, nullable=False)
    fecha_ingreso = db.Column(db.Date, nullable=False)
    password = db.Column(db.String(30), nullable=False)  # Nuevo campo
    activo = db.Column(db.Boolean, default=True)

    # Relaciones
    cargo = db.relationship('Cargo', backref=db.backref('empleados', lazy=True))
    sede = db.relationship('Sede', backref=db.backref('empleados', lazy=True))
    empresa = db.relationship('Empresa', backref=db.backref('empleados', lazy=True))

    def __init__(self, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, id_cargo, id_sede, id_empresa, fecha_nacimiento, fecha_ingreso, password, activo=True):
        self.primer_nombre = primer_nombre
        self.segundo_nombre = segundo_nombre
        self.primer_apellido = primer_apellido
        self.segundo_apellido = segundo_apellido
        self.id_cargo = id_cargo
        self.id_sede = id_sede
        self.id_empresa = id_empresa
        self.fecha_nacimiento = fecha_nacimiento
        self.fecha_ingreso = fecha_ingreso
        self.password = password
        self.activo = activo

    def to_dict(self):
        return {
            "id_empleado": self.id_empleado,
            "primer_nombre": self.primer_nombre,
            "segundo_nombre": self.segundo_nombre,
            "primer_apellido": self.primer_apellido,
            "segundo_apellido": self.segundo_apellido,
            "id_cargo": self.id_cargo,
            "id_sede": self.id_sede,
            "id_empresa": self.id_empresa,
            "fecha_nacimiento": str(self.fecha_nacimiento),
            "fecha_ingreso": str(self.fecha_ingreso),
            "password": self.password,
            "activo": self.activo
        }
