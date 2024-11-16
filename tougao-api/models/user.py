from config.db_config import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'member', 'editor', 'admin'
    gender = db.Column(db.String(10), nullable=True)
    education = db.Column(db.String(50), nullable=True)
    major = db.Column(db.String(50), nullable=True)

    def __init__(self, username, password, role, gender, education, major):
        self.username = username
        self.password = password
        self.role = role
        self.gender = gender
        self.education = education
        self.major = major

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'role': self.role,
            'gender': self.gender,
            'education': self.education,
            'major': self.major
        }
