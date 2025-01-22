from model.db import db

class Sede(db.Model):
    __tablename__ = 'sedes'
    id_sede = db.Column(db.Integer, primary_key=True)
    nombre_sede = db.Column(db.String(100), nullable=False)
    estado = db.Column(db.Boolean, default=True, nullable=False)

    def __init__(self, nombre_sede, estado=True):
        self.nombre_sede = nombre_sede
        self.estado = estado

    def to_dict(self):
        return {
            "id_sede": self.id_sede,
            "nombre_sede": self.nombre_sede,
            "estado": self.estado
        }
