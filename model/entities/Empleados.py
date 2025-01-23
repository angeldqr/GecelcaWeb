from model.db import db

class Empleado(db.Model):
    __tablename__ = 'empleados'
    id_empleado = db.Column(db.Integer, primary_key=True)
    primer_nombre = db.Column(db.String(50), nullable=False)
    segundo_nombre = db.Column(db.String(50))
    primer_apellido = db.Column(db.String(50), nullable=False)
    segundo_apellido = db.Column(db.String(50))
    id_cargo = db.Column(db.Integer, db.ForeignKey('cargos.id_cargo'), nullable=False)
    id_sede = db.Column(db.Integer, db.ForeignKey('sedes.id_sede'), nullable=False)
    id_empresa = db.Column(db.Integer, db.ForeignKey('empresas.id_empresa'), nullable=False)
    id_area = db.Column(db.Integer, db.ForeignKey('areas.id_area'), nullable=False)
    fecha_nacimiento = db.Column(db.Date, nullable=False)
    fecha_ingreso = db.Column(db.Date, nullable=False)
    estado = db.Column(db.Boolean, default=True, nullable=False)

    def __init__(self, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido,
                 id_cargo, id_sede, id_empresa, id_area, fecha_nacimiento, fecha_ingreso, estado=True):
        self.primer_nombre = primer_nombre
        self.segundo_nombre = segundo_nombre
        self.primer_apellido = primer_apellido
        self.segundo_apellido = segundo_apellido
        self.id_cargo = id_cargo
        self.id_sede = id_sede
        self.id_empresa = id_empresa
        self.id_area = id_area
        self.fecha_nacimiento = fecha_nacimiento
        self.fecha_ingreso = fecha_ingreso
        self.estado = estado

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
            "id_area": self.id_area,
            "fecha_nacimiento": self.fecha_nacimiento,
            "fecha_ingreso": self.fecha_ingreso,
            "estado": self.estado
        }
