from flask import Blueprint, request, jsonify
from services.member_service import submit_paper, get_paper_by_id, update_paper_status
from models.paper import PaperStatus, Paper
from config.db_config import db
member_bp = Blueprint('member', __name__)

# 英文到中文的映射字典
STATUS_TRANSLATION = {
    PaperStatus.SUBMITTED: '投稿',
    PaperStatus.UNDER_REVIEW: '审稿中',
    PaperStatus.REJECTED: '拒稿',
    PaperStatus.ACCEPTED: '通过'
}

# 反向映射，前端传递中文状态到英文数据库状态
STATUS_TRANSLATION_REVERSE = {
    '投稿': PaperStatus.SUBMITTED,
    '审稿中': PaperStatus.UNDER_REVIEW,
    '拒稿': PaperStatus.REJECTED,
    '通过': PaperStatus.ACCEPTED
}

@member_bp.route('/post-paper', methods=['POST'])
def post_paper():
    data = request.form
    file = request.files['file']

    # 从请求中获取其他字段
    title = data.get('title')
    authors = data.get('authors')
    affiliation = data.get('affiliation')
    abstract = data.get('abstract')
    keywords = data.get('keywords')

    # 调用服务层的 submit_paper 方法
    response, status_code = submit_paper(title, authors, affiliation, abstract, keywords, file)

    # 直接返回响应对象
    return response, status_code

def serialize_paper(paper):
    return {
        "id": paper.id,
        "title": paper.title,
        "authors": paper.authors,
        "affiliation": paper.affiliation,
        "abstract": paper.abstract,
        "keywords": paper.keywords,
        "status": STATUS_TRANSLATION.get(paper.status, paper.status),  # 转换为中文状态
        "file_path": paper.file_path,
        "editor_name": paper.editor_name  # 增加编辑姓名
    }

@member_bp.route('/get-paper/<int:paper_id>', methods=['GET'])
def get_paper(paper_id):
    paper = get_paper_by_id(paper_id)
    if paper:
        return jsonify(serialize_paper(paper)), 200
    else:
        return jsonify({"message": "稿件未找到"}), 404


@member_bp.route('/get-papers', methods=['GET'])
def get_papers():
    title_filter = request.args.get('title', '')  # 获取标题过滤条件
    status_filter = request.args.get('status', '')  # 获取状态过滤条件（中文）

    query = Paper.query  # 初始化查询

    # 标题模糊查询
    if title_filter:
        query = query.filter(Paper.title.like(f'%{title_filter}%'))

    # 状态过滤（中文转英文）
    if status_filter:
        status_enum = STATUS_TRANSLATION_REVERSE.get(status_filter)  # 转换为英文状态
        if status_enum:
            query = query.filter(Paper.status == status_enum)

    papers = query.all()

    # 结果转换
    papers_list = [
        {
            "id": paper.id,
            "title": paper.title,
            "authors": paper.authors,
            "affiliation": paper.affiliation,
            "abstract": paper.abstract,
            "keywords": paper.keywords,
            "status": STATUS_TRANSLATION.get(paper.status, paper.status),  # 转换为中文状态
            "file_path": paper.file_path,
            "editor_name": paper.editor_name  # 增加编辑姓名
        } for paper in papers
    ]
    return jsonify(papers_list), 200
