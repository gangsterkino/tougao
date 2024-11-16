from models.paper import Paper, PaperStatus
from config.db_config import db
from models.paper import PaperStatus

# 状态中文到英文的映射
status_translation = {
    '投稿': 'SUBMITTED',
    '审稿': 'UNDER_REVIEW',
    '拒稿': 'REJECTED',
    '通过': 'ACCEPTED',
}
# services/editor_service.py
# services/editor_service.py
def update_paper_status(paper_id, new_status, editor_name=None):
    # 获取论文对象
    paper = Paper.query.get(paper_id)

    if not paper:
        print(f"Paper with id {paper_id} not found")  # 打印日志
        return False  # 找不到论文时返回 False

    # 更新状态
    print(f"Found paper: {paper.title}, current status: {paper.status}, editor_name: {paper.editor_name}")  # 打印当前状态

    if new_status in [status.value for status in PaperStatus]:
        paper.status = PaperStatus[new_status]  # 更新状态
        if editor_name:
            paper.editor_name = editor_name  # 更新编辑者姓名
        db.session.commit()  # 提交事务
        return True  # 更新成功
    else:
        print(f"Invalid status: {new_status}")  # 打印日志
        return False  # 如果状态无效，返回 False
