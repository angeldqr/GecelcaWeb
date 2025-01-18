from model.db import db

class Area(db.Model):
    __tablename__ = 'areas'
    id_area = db.Column(db.Integer, primary_key=True)
    nombre_area = db.Column(db.String(100), nullable=False)
    estado = db.Column(db.Boolean, default=True, nullable=False)  # Campo estado

    def __init__(self, nombre_area, estado=True):
        self.nombre_area = nombre_area
        self.estado = estado

    def to_dict(self):
        return {
            "id_area": self.id_area,
            "nombre_area": self.nombre_area,
            "estado": self.estado
        }
