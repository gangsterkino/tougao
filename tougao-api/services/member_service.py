from werkzeug.utils import secure_filename
import os
from datetime import datetime
from config.db_config import db
from models.paper import Paper, PaperStatus
from flask import jsonify

UPLOAD_FOLDER = 'uploads/papers'
ALLOWED_EXTENSIONS = {'doc', 'docx'}

# 检查文件类型是否允许
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# 投稿功能
def submit_paper(title, authors, affiliation, abstract, keywords, file):
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)  # 如果文件夹不存在则创建

    if not allowed_file(file.filename):
        return jsonify({"success": False, "message": "文件类型不支持"}), 400  # 文件类型不支持

    # 获取当前时间戳并生成新文件名
    filename = secure_filename(file.filename)
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    new_filename = f"{timestamp}_{filename}"
    file_path = os.path.join(UPLOAD_FOLDER, new_filename)

    # 保存文件
    try:
        file.save(file_path)
    except Exception as e:
        return jsonify({"success": False, "message": f"文件保存失败: {str(e)}"}), 500  # 如果文件保存失败

    # 创建并保存 Paper 实体
    paper = Paper(
        title=title,
        authors=authors,
        affiliation=affiliation,
        abstract=abstract,
        keywords=keywords,
        file_path=file_path,
        status=PaperStatus.SUBMITTED  # 默认状态为 'SUBMITTED'
    )

    try:
        db.session.add(paper)
        db.session.commit()
    except Exception as e:
        db.session.rollback()  # 如果数据库操作失败，回滚
        return jsonify({"success": False, "message": f"数据库保存失败: {str(e)}"}), 500

    # 返回成功消息和论文ID
    return jsonify({
        "success": True,
        "message": "论文提交成功",
        "paper": {
            "id": paper.id,
            "title": paper.title,
            "authors": paper.authors,
            "affiliation": paper.affiliation,
            "abstract": paper.abstract,
            "keywords": paper.keywords,
            "status": paper.status.value,  # 论文状态
            "file_path": paper.file_path
        }
    }), 201

# 查询论文信息

def get_paper_by_id(paper_id):
    paper = Paper.query.get(paper_id)  # 根据 ID 查询论文
    if paper:
        return {
            "id": paper.id,
            "title": paper.title,
            "authors": paper.authors,
            "affiliation": paper.affiliation,
            "abstract": paper.abstract,
            "keywords": paper.keywords,
            "status": paper.status.value,  # 返回状态值
            "file_path": paper.file_path,
            "editor_name": paper.editor_name  # 增加 editor_name 信息
        }
    else:
        return None  # 未找到论文

# 更新论文状态
def update_paper_status(paper_id, new_status):
    paper = Paper.query.get(paper_id)

    if paper:
        if new_status in [status.value for status in PaperStatus]:
            paper.status = PaperStatus[new_status]  # 设置新的状态
            db.session.commit()
            return True
        else:
            return False  # 如果状态无效
    else:
        return False  # 如果找不到该论文

# 查询所有论文信息
def get_all_papers():
    papers = Paper.query.all()  # 查询所有论文
    paper_list = []
    for paper in papers:
        paper_list.append({
            "id": paper.id,
            "title": paper.title,
            "authors": paper.authors,
            "affiliation": paper.affiliation,
            "abstract": paper.abstract,
            "keywords": paper.keywords,
            "status": paper.status.value,  # 返回状态值
            "file_path": paper.file_path,
            "editor_name": paper.editor_name  # 包含 editor_name 信息
        })
    return paper_list
