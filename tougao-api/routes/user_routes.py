from flask import Blueprint, request, jsonify
from services.user_service import register_user, login_user, get_user_details, update_password
from config.db_config import db

user_bp = Blueprint('user', __name__)


@user_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    role = data.get('role')
    password = data.get('password')
    gender = data.get('gender')
    education = data.get('education')
    major = data.get('major')

    # 用户注册
    new_user = register_user(username, role, password, gender, education, major)

    return jsonify({'message': 'User registered successfully', 'user': new_user.username}), 201


@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    role = data.get('role')
    password = data.get('password')

    # 用户登录验证
    user = login_user(username, role, password)

    if user:
        return jsonify({'message': 'Login successful', 'username': user.username}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401


# 获取用户详细信息
@user_bp.route('/details', methods=['GET'])
def get_details():
    username = request.args.get('username')
    role = request.args.get('role')

    # 获取用户详细信息
    user = get_user_details(username, role)

    if user:
        return jsonify({
            'name': user.username,
            'role': user.role,
            'gender': user.gender,
            'education': user.education,
            'major': user.major
        }), 200
    else:
        return jsonify({'message': 'User not found'}), 404


@user_bp.route('/update_profile', methods=['POST'])
def update_profile():
    data = request.get_json()
    username = data.get('username')
    role = data.get('role')
    education = data.get('education')
    major = data.get('major')

    user = get_user_details(username, role)

    if user:
        # 更新教育和专业字段
        user.education = education
        user.major = major

        db.session.commit()  # 提交数据库更改
        return jsonify({'message': 'Profile updated successfully'}), 200
    else:
        return jsonify({'message': 'User not found'}), 404


# 更新密码
@user_bp.route('/update_password', methods=['POST'])
def update_user_password():
    data = request.get_json()
    username = data.get('username')
    role = data.get('role')
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    # 更新密码
    user = update_password(username, role, current_password, new_password)

    if user:
        return jsonify({'message': 'Password updated successfully'}), 200
    else:
        return jsonify({'message': 'Failed to update password. Invalid credentials.'}), 401