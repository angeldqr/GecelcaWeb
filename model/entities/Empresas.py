from model.db import db

class Empresa(db.Model):
    __tablename__ = 'empresas'
    id_empresa = db.Column(db.Integer, primary_key=True)
    nombre_empresa = db.Column(db.String(100), nullable=False)

    def __init__(self, nombre_empresa):
        self.nombre_empresa = nombre_empresa

    def to_dict(self):
        return {"id_empresa": self.id_empresa, "nombre_empresa": self.nombre_empresa}
