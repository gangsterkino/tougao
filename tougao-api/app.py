from flask import Flask
from flask_cors import CORS  # 导入 CORS
from config.db_config import init_app
from routes.user_routes import user_bp
from routes.admin_routes import admin_bp  # 引入管理员路由
from routes.member_routes import member_bp
from routes.editor_routes import editor_bp
app = Flask(__name__)
CORS(app)  # 启用跨域请求，允许所有域名访问

# 配置数据库
init_app(app)

# 注册用户路由
app.register_blueprint(user_bp, url_prefix='/api/user')
# 注册管理员路由
app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(member_bp, url_prefix='/api/member')
app.register_blueprint(editor_bp,url_prefix='/api/editor')

if __name__ == '__main__':
    app.run(debug=True)
