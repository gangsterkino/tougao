from enum import Enum as PyEnum
from sqlalchemy import Enum
from config.db_config import db

# 定义数据库中的状态枚举类 (英文)
class PaperStatus(PyEnum):
    SUBMITTED = 'SUBMITTED'  # 投稿
    UNDER_REVIEW = 'UNDER_REVIEW'  # 审稿
    REJECTED = 'REJECTED'  # 拒稿
    ACCEPTED = 'ACCEPTED'  # 通过

# 状态映射 (英文到中文)
status_mapping = {
    PaperStatus.SUBMITTED: '投稿',
    PaperStatus.UNDER_REVIEW: '审稿中',
    PaperStatus.REJECTED: '拒稿',
    PaperStatus.ACCEPTED: '通过',
}

# 反向映射 (中文到英文)
reverse_status_mapping = {v: k for k, v in status_mapping.items()}

# 定义 Paper 模型
class Paper(db.Model):
    __tablename__ = 'paper'  # 确保表名为 'paper'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    authors = db.Column(db.String(255), nullable=False)
    affiliation = db.Column(db.String(255), nullable=False)
    abstract = db.Column(db.Text, nullable=False)
    keywords = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)

    # 使用英文的枚举状态，存储在数据库中
    status = db.Column(Enum(PaperStatus), default=PaperStatus.SUBMITTED)  # 设置为枚举类型

    # 新增 editor_name 列，允许为空
    editor_name = db.Column(db.String(255), nullable=True)

    created_at = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())
    updated_at = db.Column(db.TIMESTAMP, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def get_status_display(self):
        """获取状态的中文描述"""
        return status_mapping.get(self.status, '未知状态')  # 默认值为 '未知状态'
