from flask import Blueprint, request, jsonify
from services.admin_service import get_all_users, create_user, update_user, delete_user

admin_bp = Blueprint('admin', __name__)


# 获取所有用户，支持分页和查询
@admin_bp.route('/users', methods=['GET'])
def get_users():
    name = request.args.get('name')  # 获取请求中的姓名查询参数
    role = request.args.get('role')  # 获取请求中的角色查询参数

    users = get_all_users(name=name, role=role)  # 调用服务层方法获取符合条件的用户
    return jsonify({'users': users}), 200

# 创建用户
@admin_bp.route('/user', methods=['POST'])
def create_new_user():
    data = request.get_json()
    username = data.get('username')
    role = data.get('role')
    gender = data.get('gender')
    education = data.get('education')
    major = data.get('major')
    password =data.get('password')
    new_user = create_user(username, role, gender, education, major,password)

    return jsonify({'message': '用户创建成功', 'user': new_user.to_dict()}), 201


# 更新用户信息
@admin_bp.route('/user/<int:user_id>', methods=['PUT'])
def update_user_info(user_id):
    data = request.get_json()
    username = data.get('username')
    role = data.get('role')
    gender = data.get('gender')
    education = data.get('education')
    major = data.get('major')

    updated_user = update_user(user_id, username, role, gender, education, major)

    if updated_user:
        return jsonify({'message': '用户更新成功', 'user': updated_user.to_dict()}), 200
    else:
        return jsonify({'message': '用户未找到'}), 404


# 删除用户
@admin_bp.route('/user/<int:user_id>', methods=['DELETE'])
def delete_user_by_id(user_id):
    deleted = delete_user(user_id)

    if deleted:
        return jsonify({'message': '用户删除成功'}), 200
    else:
        return jsonify({'message': '用户未找到'}), 404
