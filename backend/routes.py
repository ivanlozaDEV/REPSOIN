from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, create_access_token
from werkzeug.security import check_password_hash
from backend.models import User, Category, Subcategory, Product, Service, Inquiry, ProductImage
from backend.extensions import db

api_blueprint = Blueprint('api', __name__)

@api_blueprint.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"error": "Username and password are required"}), 400

    user = User.query.filter_by(username=data['username']).first()
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({"error": "Invalid username or password"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token}), 200

# User Routes
@api_blueprint.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_list = [user.serialize() for user in users]
    return jsonify(users_list)

@api_blueprint.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user.serialize())

@api_blueprint.route('/users', methods=['POST'])
def add_user():
    try:
        data = request.json
        if 'username' not in data or 'password' not in data or 'role' not in data:
            return jsonify({"error": "Username, password, and role are required"}), 400

        new_user = User(username=data['username'], role=data['role'])
        new_user.set_password(data['password'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User added successfully!"}), 201
    except Exception as e:
        print(f"Error adding user: {e}")
        return jsonify({"error": "Failed to add user"}), 500

@api_blueprint.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    try:
        data = request.json
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        if 'username' in data:
            user.username = data['username']
        if 'password' in data:
            user.set_password(data['password'])
        if 'role' in data:
            user.role = data['role']

        db.session.commit()
        return jsonify({"message": "User updated successfully!"}), 200
    except Exception as e:
        print(f"Error updating user: {e}")
        return jsonify({"error": "Failed to update user"}), 500

@api_blueprint.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully!"}), 200
    except Exception as e:
        print(f"Error deleting user: {e}")
        return jsonify({"error": "Failed to delete user"}), 500

# Category Routes
@api_blueprint.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    categories_list = [category.serialize() for category in categories]
    return jsonify(categories_list)

@api_blueprint.route('/categories/<int:category_id>', methods=['GET'])
def get_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"error": "Category not found"}), 404
    return jsonify(category.serialize())

@api_blueprint.route('/categories', methods=['POST'])
@jwt_required()
def add_category():
    try:
        data = request.json
        if 'name' not in data:
            return jsonify({"error": "Name is required"}), 400

        new_category = Category(
            name=data['name'],
            image_url=data.get('image_url')
        )
        db.session.add(new_category)
        db.session.commit()
        return jsonify({"message": "Category added successfully!", "category": new_category.serialize()}), 201
    except Exception as e:
        print(f"Error adding category: {e}")
        return jsonify({"error": "Failed to add category"}), 500

@api_blueprint.route('/categories/<int:category_id>', methods=['PUT'])
@jwt_required()
def update_category(category_id):
    try:
        data = request.json
        category = Category.query.get(category_id)
        if not category:
            return jsonify({"error": "Category not found"}), 404

        if 'name' in data:
            category.name = data['name']
        if 'image_url' in data:
            category.image_url = data['image_url']

        db.session.commit()
        return jsonify({"message": "Category updated successfully!", "category": category.serialize()}), 200
    except Exception as e:
        print(f"Error updating category: {e}")
        return jsonify({"error": "Failed to update category"}), 500


@api_blueprint.route('/categories/<int:category_id>', methods=['DELETE'])
@jwt_required()
def delete_category(category_id):
    try:
        category = Category.query.get(category_id)
        if not category:
            return jsonify({"error": "Category not found"}), 404

        db.session.delete(category)
        db.session.commit()
        return jsonify({"message": "Category deleted successfully!"}), 200
    except Exception as e:
        print(f"Error deleting category: {e}")
        return jsonify({"error": "Failed to delete category"}), 500

# Subcategory Routes
@api_blueprint.route('/subcategories', methods=['GET'])
def get_subcategories():
    subcategories = Subcategory.query.all()
    subcategories_list = [subcategory.serialize() for subcategory in subcategories]
    return jsonify(subcategories_list)

@api_blueprint.route('/subcategories/<int:subcategory_id>', methods=['GET'])
def get_subcategory(subcategory_id):
    subcategory = Subcategory.query.get(subcategory_id)
    if not subcategory:
        return jsonify({"error": "Subcategory not found"}), 404
    return jsonify(subcategory.serialize())

@api_blueprint.route('/subcategories', methods=['POST'])
@jwt_required()
def add_subcategory():
    try:
        data = request.json
        if 'name' not in data or 'category_id' not in data:
            return jsonify({"error": "Name and category_id are required"}), 400

        new_subcategory = Subcategory(
            name=data['name'],
            category_id=data['category_id'],
            image_url=data.get('image_url')
        )
        db.session.add(new_subcategory)
        db.session.commit()
        return jsonify({"message": "Subcategory added successfully!", "subcategory": new_subcategory.serialize()}), 201
    except Exception as e:
        print(f"Error adding subcategory: {e}")
        return jsonify({"error": "Failed to add subcategory"}), 500

@api_blueprint.route('/subcategories/<int:subcategory_id>', methods=['PUT'])
@jwt_required()
def update_subcategory(subcategory_id):
    try:
        data = request.json
        subcategory = Subcategory.query.get(subcategory_id)
        if not subcategory:
            return jsonify({"error": "Subcategory not found"}), 404

        if 'name' in data:
            subcategory.name = data['name']
        if 'category_id' in data:
            subcategory.category_id = data['category_id']
        if 'image_url' in data:
            subcategory.image_url = data['image_url']

        db.session.commit()
        return jsonify({"message": "Subcategory updated successfully!", "subcategory": subcategory.serialize()}), 200
    except Exception as e:
        print(f"Error updating subcategory: {e}")
        return jsonify({"error": "Failed to update subcategory"}), 500

@api_blueprint.route('/subcategories/<int:subcategory_id>', methods=['DELETE'])
@jwt_required()
def delete_subcategory(subcategory_id):
    try:
        subcategory = Subcategory.query.get(subcategory_id)
        if not subcategory:
            return jsonify({"error": "Subcategory not found"}), 404

        db.session.delete(subcategory)
        db.session.commit()
        return jsonify({"message": "Subcategory deleted successfully!"}), 200
    except Exception as e:
        print(f"Error deleting subcategory: {e}")
        return jsonify({"error": "Failed to delete subcategory"}), 500

# Product Routes
@api_blueprint.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    products_list = [product.serialize() for product in products]
    return jsonify(products_list)

@api_blueprint.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    return jsonify(product.serialize())

@api_blueprint.route('/products', methods=['POST'])
@jwt_required()
def add_product():
    try:
        data = request.json
        if 'name' not in data or 'price' not in data or 'stock' not in data or 'subcategory_id' not in data:
            return jsonify({"error": "Name, price, stock, and subcategory_id are required"}), 400

        new_product = Product(
            name=data['name'],
            description=data.get('description'),
            price=data['price'],
            stock=data['stock'],
            subcategory_id=data['subcategory_id']
        )
        db.session.add(new_product)
        db.session.commit()
        return jsonify({"message": "Product added successfully!"}), 201
    except Exception as e:
        print(f"Error adding product: {e}")
        return jsonify({"error": "Failed to add product"}), 500

@api_blueprint.route('/products/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    try:
        data = request.json
        product = Product.query.get(product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404

        if 'name' in data:
            product.name = data['name']
        if 'description' in data:
            product.description = data['description']
        if 'price' in data:
            product.price = data['price']
        if 'stock' in data:
            product.stock = data['stock']
        if 'subcategory_id' in data:
            product.subcategory_id = data['subcategory_id']

        db.session.commit()
        return jsonify({"message": "Product updated successfully!"}), 200
    except Exception as e:
        print(f"Error updating product: {e}")
        return jsonify({"error": "Failed to update product"}), 500

@api_blueprint.route('/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404

        db.session.delete(product)
        db.session.commit()
        return jsonify({"message": "Product deleted successfully!"}), 200
    except Exception as e:
        print(f"Error deleting product: {e}")
        return jsonify({"error": "Failed to delete product"}), 500

# ProductImage Routes
@api_blueprint.route('/product_images', methods=['GET'])
def get_product_images():
    product_images = ProductImage.query.all()
    product_images_list = [product_image.serialize() for product_image in product_images]
    return jsonify(product_images_list)

@api_blueprint.route('/product_images/<int:product_image_id>', methods=['GET'])
def get_product_image(product_image_id):
    product_image = ProductImage.query.get(product_image_id)
    if not product_image:
        return jsonify({"error": "ProductImage not found"}), 404
    return jsonify(product_image.serialize())

@api_blueprint.route('/product_images', methods=['POST'])
@jwt_required()
def add_product_image():
    try:
        data = request.json
        if 'url' not in data or 'product_id' not in data:
            return jsonify({"error": "URL and product_id are required"}), 400

        new_product_image = ProductImage(
            url=data['url'],
            product_id=data['product_id']
        )
        db.session.add(new_product_image)
        db.session.commit()
        return jsonify({"message": "ProductImage added successfully!"}), 201
    except Exception as e:
        print(f"Error adding product_image: {e}")
        return jsonify({"error": "Failed to add product_image"}), 500

@api_blueprint.route('/product_images/<int:product_image_id>', methods=['PUT'])
@jwt_required()
def update_product_image(product_image_id):
    try:
        data = request.json
        product_image = ProductImage.query.get(product_image_id)
        if not product_image:
            return jsonify({"error": "ProductImage not found"}), 404

        if 'url' in data:
            product_image.url = data['url']
        if 'product_id' in data:
            product_image.product_id = data['product_id']

        db.session.commit()
        return jsonify({"message": "ProductImage updated successfully!"}), 200
    except Exception as e:
        print(f"Error updating product_image: {e}")
        return jsonify({"error": "Failed to update product_image"}), 500

@api_blueprint.route('/product_images/<int:product_image_id>', methods=['DELETE'])
@jwt_required()
def delete_product_image(product_image_id):
    try:
        product_image = ProductImage.query.get(product_image_id)
        if not product_image:
            return jsonify({"error": "ProductImage not found"}), 404

        db.session.delete(product_image)
        db.session.commit()
        return jsonify({"message": "ProductImage deleted successfully!"}), 200
    except Exception as e:
        print(f"Error deleting product_image: {e}")
        return jsonify({"error": "Failed to delete product_image"}), 500

# Service Routes
@api_blueprint.route('/services', methods=['GET'])
def get_services():
    services = Service.query.all()
    services_list = [service.serialize() for service in services]
    return jsonify(services_list)

@api_blueprint.route('/services/<int:service_id>', methods=['GET'])
def get_service(service_id):
    service = Service.query.get(service_id)
    if not service:
        return jsonify({"error": "Service not found"}), 404
    return jsonify(service.serialize())

@api_blueprint.route('/services', methods=['POST'])
@jwt_required()
def add_service():
    try:
        data = request.json
        if 'name' not in data:
            return jsonify({"error": "Name is required"}), 400

        new_service = Service(
            name=data['name'],
            description=data.get('description'),
            image_url=data.get('image_url')
        )
        db.session.add(new_service)
        db.session.commit()
        return jsonify({"message": "Service added successfully!", "service": new_service.serialize()}), 201
    except Exception as e:
        print(f"Error adding service: {e}")
        return jsonify({"error": "Failed to add service"}), 500

@api_blueprint.route('/services/<int:service_id>', methods=['PUT'])
@jwt_required()
def update_service(service_id):
    try:
        data = request.json
        service = Service.query.get(service_id)
        if not service:
            return jsonify({"error": "Service not found"}), 404

        if 'name' in data:
            service.name = data['name']
        if 'description' in data:
            service.description = data['description']
        if 'image_url' in data:
            service.image_url = data['image_url']

        db.session.commit()
        return jsonify({"message": "Service updated successfully!", "service": service.serialize()}), 200
    except Exception as e:
        print(f"Error updating service: {e}")
        return jsonify({"error": "Failed to update service"}), 500

@api_blueprint.route('/services/<int:service_id>', methods=['DELETE'])
@jwt_required()
def delete_service(service_id):
    try:
        service = Service.query.get(service_id)
        if not service:
            return jsonify({"error": "Service not found"}), 404

        db.session.delete(service)
        db.session.commit()
        return jsonify({"message": "Service deleted successfully!"}), 200
    except Exception as e:
        print(f"Error deleting service: {e}")
        return jsonify({"error": "Failed to delete service"}), 500
    
@api_blueprint.route('/inquiries', methods=['GET'])
def get_inquiries():
    inquiries = Inquiry.query.all()
    inquiries_list = [inquiry.serialize() for inquiry in inquiries]
    return jsonify(inquiries_list)

@api_blueprint.route('/inquiries/<int:inquiry_id>', methods=['GET'])
def get_inquiry(inquiry_id):
    inquiry = Inquiry.query.get(inquiry_id)
    if not inquiry:
        return jsonify({"error": "Inquiry not found"}), 404
    return jsonify(inquiry.serialize())

@api_blueprint.route('/inquiries', methods=['POST'])
def add_inquiry():
    try:
        data = request.json
        if 'name' not in data or 'email' not in data or 'city' not in data or 'phone' not in data or 'message' not in data or 'product_id' not in data:
            return jsonify({"error": "Name, email, city, phone, message, and product_id are required"}), 400

        new_inquiry = Inquiry(
            name=data['name'],
            email=data['email'],
            city=data['city'],
            phone=data['phone'],
            message=data['message'],
            product_id=data['product_id']
        )
        db.session.add(new_inquiry)
        db.session.commit()
        return jsonify({"message": "Inquiry added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_blueprint.route('/inquiries/<int:inquiry_id>', methods=['PUT'])
def update_inquiry(inquiry_id):
    try:
        inquiry = Inquiry.query.get(inquiry_id)
        if not inquiry:
            return jsonify({"error": "Inquiry not found"}), 404

        data = request.json
        inquiry.name = data.get('name', inquiry.name)
        inquiry.email = data.get('email', inquiry.email)
        inquiry.city = data.get('city', inquiry.city)
        inquiry.phone = data.get('phone', inquiry.phone)
        inquiry.message = data.get('message', inquiry.message)
        inquiry.product_id = data.get('product_id', inquiry.product_id)

        db.session.commit()
        return jsonify({"message": "Inquiry updated successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api_blueprint.route('/inquiries/<int:inquiry_id>', methods=['DELETE'])
def delete_inquiry(inquiry_id):
    try:
        inquiry = Inquiry.query.get(inquiry_id)
        if not inquiry:
            return jsonify({"error": "Inquiry not found"}), 404

        db.session.delete(inquiry)
        db.session.commit()
        return jsonify({"message": "Inquiry deleted successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
