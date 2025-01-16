from flask import Blueprint, jsonify, request
from backend.models import User, Category, Product, ProductImage, Inquiry
from backend.extensions import db

api_blueprint = Blueprint('api', __name__)

# User Routes
@api_blueprint.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_list = [user.serialize() for user in users]
    return jsonify(users_list)

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
def update_user(user_id):
    try:
        data = request.json
        user = User.query.get(user_id)
        if user is None:
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
def delete_user(user_id):
    try:
        user = User.query.get(user_id)
        if user is None:
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

@api_blueprint.route('/categories', methods=['POST'])
def add_category():
    try:
        data = request.json
        if 'name' not in data:
            return jsonify({"error": "Name is required"}), 400

        new_category = Category(name=data['name'])
        db.session.add(new_category)
        db.session.commit()
        return jsonify({"message": "Category added successfully!"}), 201
    except Exception as e:
        print(f"Error adding category: {e}")
        return jsonify({"error": "Failed to add category"}), 500

@api_blueprint.route('/categories/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    try:
        data = request.json
        category = Category.query.get(category_id)
        if category is None:
            return jsonify({"error": "Category not found"}), 404

        if 'name' in data:
            category.name = data['name']

        db.session.commit()
        return jsonify({"message": "Category updated successfully!"}), 200
    except Exception as e:
        print(f"Error updating category: {e}")
        return jsonify({"error": "Failed to update category"}), 500

@api_blueprint.route('/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    try:
        category = Category.query.get(category_id)
        if category is None:
            return jsonify({"error": "Category not found"}), 404

        db.session.delete(category)
        db.session.commit()
        return jsonify({"message": "Category deleted successfully!"}), 200
    except Exception as e:
        print(f"Error deleting category: {e}")
        return jsonify({"error": "Failed to delete category"}), 500

# Product Routes
@api_blueprint.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    products_list = [product.serialize() for product in products]
    return jsonify(products_list)

@api_blueprint.route('/products', methods=['POST'])
def add_product():
    try:
        data = request.json
        if 'name' not in data or 'price' not in data or 'stock' not in data or 'category_id' not in data:
            return jsonify({"error": "Name, price, stock, and category_id are required"}), 400

        new_product = Product(
            name=data['name'],
            description=data.get('description'),
            price=data['price'],
            stock=data['stock'],
            category_id=data['category_id']
        )
        db.session.add(new_product)
        db.session.commit()
        return jsonify({"message": "Product added successfully!"}), 201
    except Exception as e:
        print(f"Error adding product: {e}")
        return jsonify({"error": "Failed to add product"}), 500

@api_blueprint.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    try:
        data = request.json
        product = Product.query.get(product_id)
        if product is None:
            return jsonify({"error": "Product not found"}), 404

        if 'name' in data:
            product.name = data['name']
        if 'description' in data:
            product.description = data['description']
        if 'price' in data:
            product.price = data['price']
        if 'stock' in data:
            product.stock = data['stock']
        if 'category_id' in data:
            product.category_id = data['category_id']

        db.session.commit()
        return jsonify({"message": "Product updated successfully!"}), 200
    except Exception as e:
        print(f"Error updating product: {e}")
        return jsonify({"error": "Failed to update product"}), 500

@api_blueprint.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        product = Product.query.get(product_id)
        if product is None:
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

@api_blueprint.route('/product_images', methods=['POST'])
def add_product_image():
    try:
        data = request.json
        if 'url' not in data or 'product_id' not in data:
            return jsonify({"error": "URL and product_id are required"}), 400

        new_product_image = ProductImage(url=data['url'], product_id=data['product_id'])
        db.session.add(new_product_image)
        db.session.commit()
        return jsonify({"message": "Product image added successfully!"}), 201
    except Exception as e:
        print(f"Error adding product image: {e}")
        return jsonify({"error": "Failed to add product image"}), 500

@api_blueprint.route('/product_images/<int:product_image_id>', methods=['PUT'])
def update_product_image(product_image_id):
    try:
        data = request.json
        product_image = ProductImage.query.get(product_image_id)
        if product_image is None:
            return jsonify({"error": "Product image not found"}), 404

        if 'url' in data:
            product_image.url = data['url']
        if 'product_id' in data:
            product_image.product_id = data['product_id']

        db.session.commit()
        return jsonify({"message": "Product image updated successfully!"}), 200
    except Exception as e:
        print(f"Error updating product image: {e}")
        return jsonify({"error": "Failed to update product image"}), 500

@api_blueprint.route('/product_images/<int:product_image_id>', methods=['DELETE'])
def delete_product_image(product_image_id):
    try:
        product_image = ProductImage.query.get(product_image_id)
        if product_image is None:
            return jsonify({"error": "Product image not found"}), 404

        db.session.delete(product_image)
        db.session.commit()
        return jsonify({"message": "Product image deleted successfully!"}), 200
    except Exception as e:
        print(f"Error deleting product image: {e}")
        return jsonify({"error": "Failed to delete product image"}), 500

# Inquiry Routes
@api_blueprint.route('/inquiries', methods=['GET'])
def get_inquiries():
    inquiries = Inquiry.query.all()
    inquiries_list = [inquiry.serialize() for inquiry in inquiries]
    return jsonify(inquiries_list)

@api_blueprint.route('/inquiries', methods=['POST'])
def add_inquiry():
    try:
        data = request.json
        if 'name' not in data or 'email' not in data or 'message' not in data or 'product_id' not in data:
            return jsonify({"error": "Name, email, message, and product_id are required"}), 400

        new_inquiry = Inquiry(
            name=data['name'],
            email=data['email'],
            message=data['message'],
            product_id=data['product_id']
        )
        db.session.add(new_inquiry)
        db.session.commit()
        return jsonify({"message": "Inquiry added successfully!"}), 201
    except Exception as e:
        print(f"Error adding inquiry: {e}")
        return jsonify({"error": "Failed to add inquiry"}), 500

@api_blueprint.route('/inquiries/<int:inquiry_id>', methods=['PUT'])
def update_inquiry(inquiry_id):
    try:
        data = request.json
        inquiry = Inquiry.query.get(inquiry_id)
        if inquiry is None:
            return jsonify({"error": "Inquiry not found"}), 404

        if 'name' in data:
            inquiry.name = data['name']
        if 'email' in data:
            inquiry.email = data['email']
        if 'message' in data:
            inquiry.message = data['message']
        if 'product_id' in data:
            inquiry.product_id = data['product_id']

        db.session.commit()
        return jsonify({"message": "Inquiry updated successfully!"}), 200
    except Exception as e:
        print(f"Error updating inquiry: {e}")
        return jsonify({"error": "Failed to update inquiry"}), 500

@api_blueprint.route('/inquiries/<int:inquiry_id>', methods=['DELETE'])
def delete_inquiry(inquiry_id):
    try:
        inquiry = Inquiry.query.get(inquiry_id)
        if inquiry is None:
            return jsonify({"error": "Inquiry not found"}), 404

        db.session.delete(inquiry)
        db.session.commit()
        return jsonify({"message": "Inquiry deleted successfully!"}), 200
    except Exception as e:
        print(f"Error deleting inquiry: {e}")
        return jsonify({"error": "Failed to delete inquiry"}), 500