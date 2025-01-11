from model.db import db

class Area(db.Model):
    __tablename__ = 'areas'
    id_area = db.Column(db.Integer, primary_key=True)
    nombre_area = db.Column(db.String(100), nullable=False)

    def __init__(self, nombre_area):
        self.nombre_area = nombre_area

    def to_dict(self):
        return {"id_area": self.id_area, "nombre_area": self.nombre_area}
