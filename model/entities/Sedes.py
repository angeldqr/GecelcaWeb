from model.db import db
from model.entities.Empresas import Empresa

class Sede(db.Model):
    __tablename__ = 'sedes'
    id_sede = db.Column(db.Integer, primary_key=True)
    nombre_sede = db.Column(db.String(100), nullable=False)
    id_empresa = db.Column(db.Integer, db.ForeignKey('empresas.id_empresa', ondelete="CASCADE"), nullable=False)
    estado = db.Column(db.Boolean, default=True, nullable=False)  # Nuevo campo

    empresa = db.relationship('Empresa', backref=db.backref('sedes', lazy=True))

    def __init__(self, nombre_sede, id_empresa, estado=True):
        self.nombre_sede = nombre_sede
        self.id_empresa = id_empresa
        self.estado = estado

    def to_dict(self):
        return {
            "id_sede": self.id_sede,
            "nombre_sede": self.nombre_sede,
            "id_empresa": self.id_empresa,
            "estado": self.estado
        }
