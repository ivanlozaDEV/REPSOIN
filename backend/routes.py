from flask import Blueprint, jsonify, request
from backend.models import Item
from backend.extensions import db

api_blueprint = Blueprint('api', __name__)

@api_blueprint.route('/items', methods=['GET'])
def get_items():
    items = Item.query.all()
    items_list = [item.serialize() for item in items]  # Usar el método de serialización
    return jsonify(items_list)

@api_blueprint.route('/items', methods=['POST'])
def add_item():
    try:
        data = request.json
        if 'name' not in data:
            return jsonify({"error": "Name is required"}), 400

        new_item = Item(name=data['name'])
        db.session.add(new_item)
        db.session.commit()
        return jsonify({"message": "Item added successfully!"}), 201
    except Exception as e:
        print(f"Error adding item: {e}")
        return jsonify({"error": "Failed to add item"}), 500
    

@api_blueprint.route('/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    try:
        item = Item.query.get(item_id)
        if item is None:
            return jsonify({"error": "Item not found"}), 404

        db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "Item deleted successfully!"}), 200
    except Exception as e:
        print(f"Error deleting item: {e}")
        return jsonify({"error": "Failed to delete item"}), 500
