from flask import Blueprint, request, jsonify,send_from_directory
from services.editor_service import update_paper_status
from models.paper import PaperStatus
import os

# 状态中文到英文的映射
status_translation = {
    '投稿': 'SUBMITTED',
    '审稿': 'UNDER_REVIEW',
    '拒稿': 'REJECTED',
    '通过': 'ACCEPTED',
}

editor_bp = Blueprint('editor', __name__)

@editor_bp.route('/update-status/<int:paper_id>', methods=['PATCH'])
def update_status(paper_id):
    data = request.get_json()
    status = data.get('status')
    editor_name = data.get('editor_name')  # 获取编辑者姓名

    print(f"Received paper_id: {paper_id}, status: {status}, editor_name: {editor_name}")  # 打印日志

    # 将中文状态转化为英文状态
    if status not in status_translation:
        return jsonify({"message": "无效的状态值"}), 400

    english_status = status_translation[status]  # 获取对应的英文状态

    # 验证状态是否在 PaperStatus 中
    if english_status not in [status.value for status in PaperStatus]:
        return jsonify({"message": "无效的状态值"}), 400

    # 更新论文状态，同时更新 editor_name
    success = update_paper_status(paper_id, english_status, editor_name)  # 传递 editor_name
    if success:
        return jsonify({"message": "稿件状态更新成功"}), 200
    else:
        # 打印详细的错误信息，方便调试
        return jsonify({"message": "无法更新状态，稿件未找到", "paper_id": paper_id, "status": english_status}), 404


# 文件保存的目录
UPLOAD_FOLDER = 'uploads/papers'


# 新增路由用于提供文件下载
@editor_bp.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    try:
        # 检查文件是否存在
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.exists(file_path):
            return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)
        else:
            return jsonify({"error": "文件不存在"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500