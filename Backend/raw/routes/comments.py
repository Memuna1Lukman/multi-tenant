from fastapi import APIRouter,HTTPException,status,Depends,Response
from .. import models,oauth,schemas
from ..database  import get_db
from sqlalchemy.orm import Session
from typing import List


router = APIRouter(
    tags=['Comments']
)


@router.get("/tasks/{task_id}/comments",response_model=List[schemas.CommentResponse])
def get_comment(task_id:int,db:Session=Depends(get_db),current_user:models.Users = Depends(oauth.get_current_user)):
    # check if a task exist
    # if a task exist check if the person is a member of a particular project maybe i am not sure
    query_task = db.query(models.Tasks).filter(models.Tasks.id == task_id).first()
    if not query_task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"The task is not found")
    workspace_ids = query_task.project.workspace_id

    membership = db.query(models.MemberShip).filter(
        models.MemberShip.workspace_id == workspace_ids,
        models.MemberShip.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access tasks in this workspace"
        )
    comments = db.query(models.Comments).filter(models.Comments.task_id == task_id).all()
    return comments

@router.post("/tasks/{task_id}/comments",response_model=schemas.CommentResponse,status_code=status.HTTP_201_CREATED)
def create_comment(comments:schemas.CreateComment,task_id:int,db:Session=Depends(get_db),current_user:models.Users = Depends(oauth.get_current_user)):
    tasks = db.query(models.Tasks).filter(models.Tasks.id == task_id).first()
    if not tasks:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access tasks in this workspace"
        )
    query_workspace = tasks.project.workspace_id

    membership = db.query(models.MemberShip).filter(
        models.MemberShip.workspace_id == query_workspace,
        models.MemberShip.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access tasks in this workspace"
        )
    commented = comments.model_dump()
    comment_data = models.Comments(**commented,author_user_id = current_user.id,task_id =task_id)
    db.add(comment_data)
    db.commit()
    db.refresh(comment_data)
    return comment_data


@router.put("/comments/{comment_id}",response_model=schemas.CommentResponse)
def edit_comment(comment_id:int,comments:schemas.CreateComment,task_id:int,db:Session=Depends(get_db),current_user:models.Users = Depends(oauth.get_current_user)):
    query_comments = db.query(models.Comments).filter(models.Comments.id == comment_id).first()
    if not query_comments:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="This comment is not found")

    if query_comments.author_user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only edit your own comments"
        )
    query_comments.body = comments.body
    db.commit()
    db.refresh(query_comments)
    return query_comments


@router.delete("/comments/{comment_id}",status_code=status.HTTP_204_NO_CONTENT)
def del__comments(comment_id:int,task_id:int,db:Session=Depends(get_db),current_user:models.Users = Depends(oauth.get_current_user)):
    query_comments = db.query(models.Comments).filter(models.Comments.id == comment_id).first()
    if not query_comments:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="This comment is not found")
    workspace = query_comments.task.project.workspace_id

    membership = db.query(models.MemberShip).filter(
        models.MemberShip.workspace_id == workspace,
        models.MemberShip.user_id == current_user.id
    ).first()
    is_author = query_comments.author_user_id == current_user.id
    is_admin = membership.role == models.UserRole.ADMIN
    if not (is_author or is_admin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this comment"
        )
    db.delete(query_comments)
    db.commit()
    return   Response(status_code=status.HTTP_204_NO_CONTENT)



       

    
