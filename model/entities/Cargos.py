from model.db import db

class Cargo(db.Model):
    __tablename__ = 'cargos'
    id_cargo = db.Column(db.Integer, primary_key=True)
    nombre_cargo = db.Column(db.String(100), nullable=False)

    def __init__(self, nombre_cargo):
        self.nombre_cargo = nombre_cargo

    def to_dict(self):
        return {"id_cargo": self.id_cargo, "nombre_cargo": self.nombre_cargo}
