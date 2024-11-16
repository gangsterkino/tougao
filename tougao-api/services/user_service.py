from models.user import User
from config.db_config import db



# 注册用户
def register_user(username, role, password, gender, education, major):
    # 直接存储明文密码，不进行加密
    new_user = User(
        username=username,
        role=role,
        password=password,  # 保存明文密码
        gender=gender,
        education=education,
        major=major
    )

    db.session.add(new_user)
    db.session.commit()

    return new_user


# 登录验证
def login_user(username, role, password):
    # 检查是否是会员
    if role == 'member':
        user = User.query.filter_by(username=username, role='member').first()
        if user and user.password == password:
            return user

    # 检查是否是编辑或管理员，预定义数据
    if role == 'editor' or role == 'admin':
        user = User.query.filter_by(username=username, role=role).first()
        if user and user.password == password:
            return user

    return None


# 根据用户名和角色获取用户详细信息
def get_user_details(username, role):
    user = User.query.filter_by(username=username, role=role).first()
    return user

# 更新密码
def update_password(username, role, current_password, new_password):
    user = User.query.filter_by(username=username, role=role).first()

    if user and user.password == current_password:
        user.password = new_password  # 更新密码
        db.session.commit()
        return user
    else:
        return None

