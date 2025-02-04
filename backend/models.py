from datetime import datetime, timezone
from backend.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(300), nullable=False)
    role = db.Column(db.String(50), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "role": self.role
        }

class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    subcategories = db.relationship('Subcategory', backref='category', lazy=True, cascade='all, delete-orphan')
    products = db.relationship('Product', backref='category', lazy=True, cascade='all, delete-orphan')

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "image_url": self.image_url,
        }

class Subcategory(db.Model):
    __tablename__ = 'subcategories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id', ondelete='CASCADE'), nullable=False)
    products = db.relationship('Product', backref='subcategory', lazy=True, cascade='all, delete-orphan')

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "image_url": self.image_url,
            "category_id": self.category_id
        }

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    model = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=True)
    cost = db.Column(db.Float, nullable=True)
    price = db.Column(db.Float, nullable=True)
    stock = db.Column(db.Integer, nullable=True, default=0)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id', ondelete='CASCADE'), nullable=True)
    subcategory_id = db.Column(db.Integer, db.ForeignKey('subcategories.id', ondelete='CASCADE'), nullable=True)
    images = db.relationship('ProductImage', backref='product', lazy=True, cascade='all, delete-orphan')
    files = db.relationship('ProductFile', backref='product', lazy=True, cascade='all, delete-orphan')
    inquiries = db.relationship('Inquiry', backref='product', lazy=True, cascade='all, delete-orphan')

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "model": self.model,
            "description": self.description,
            "cost": self.cost,
            "price": self.price,
            "stock": self.stock,
            "category_id": self.category_id,
            "subcategory_id": self.subcategory_id,
            "images": [image.serialize() for image in self.images],
            "files": [file.serialize() for file in self.files]
        }

class ProductImage(db.Model):
    __tablename__ = 'product_images'
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(255), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id', ondelete='CASCADE'), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "url": self.url,
            "product_id": self.product_id
        }

class ProductFile(db.Model):
    __tablename__ = 'product_files'
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(255), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id', ondelete='CASCADE'), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "url": self.url,
            "product_id": self.product_id
        }

class Service(db.Model):
    __tablename__ = 'services'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(255), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "image_url": self.image_url
        }

class Inquiry(db.Model):
    __tablename__ = 'inquiries'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "city": self.city,
            "phone": self.phone,
            "message": self.message,
            "product_id": self.product_id,
            "product_name": self.product.name if self.product else None,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

