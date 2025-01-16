from backend.extensions import db

class Item(db.Model):
    __tablename__ = 'items'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }
