from models.user import User
from config.db_config import db


# 获取所有用户，支持查询
from models.user import User
from config.db_config import db

# 获取所有用户，支持查询字段过滤（单个或多个字段）
def get_all_users(name=None, role=None):
    query = User.query  # 初始化查询对象

    # 如果有姓名过滤条件
    if name:
        query = query.filter(User.username.like(f'%{name}%'))

    # 如果有角色过滤条件
    if role:
        query = query.filter(User.role == role)

    # 执行查询并返回所有符合条件的用户
    users = query.all()  # 获取所有用户数据
    return [user.to_dict() for user in users]



# 创建用户
def create_user(username, role, gender, education, major,password):
    new_user = User(
        username=username,
        role=role,
        gender=gender,
        education=education,
        major=major,
        password = password
    )

    db.session.add(new_user)
    db.session.commit()

    return new_user


# 更新用户
def update_user(user_id, username, role, gender, education, major):
    user = User.query.get(user_id)

    if user:
        user.username = username
        user.role = role
        user.gender = gender
        user.education = education
        user.major = major
        db.session.commit()
        return user
    else:
        return None


# 删除用户
def delete_user(user_id):
    user = User.query.get(user_id)

    if user:
        db.session.delete(user)
        db.session.commit()
        return True
    else:
        return False
