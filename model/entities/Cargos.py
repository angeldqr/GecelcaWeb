from model.db import db

class Cargo(db.Model):
    __tablename__ = 'cargos'
    id_cargo = db.Column(db.Integer, primary_key=True)
    nombre_cargo = db.Column(db.String(100), nullable=False)
    estado = db.Column(db.Boolean, default=True, nullable=False)  # Nuevo campo

    def __init__(self, nombre_cargo, estado=True):
        self.nombre_cargo = nombre_cargo
        self.estado = estado

    def to_dict(self):
        return {
            "id_cargo": self.id_cargo,
            "nombre_cargo": self.nombre_cargo,
            "estado": self.estado
        }
