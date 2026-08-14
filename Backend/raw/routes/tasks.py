from fastapi import APIRouter,HTTPException,status,Depends,Response
from .. import models,oauth,schemas
from ..database  import get_db
from sqlalchemy.orm import Session
from typing import List


router = APIRouter(
    tags=["Tasks"]
)

@router.get("/projects/{project_id}/tasks",response_model=List[schemas.TaskResponse])
def get_tasks(project_id:int,db:Session = Depends(get_db),current_user:int = Depends(oauth.get_current_user)):
    # the sequence is Project in Workspace then tasks in projects
    query_projects = db.query(models.Projects).filter(
        models.Projects.id == project_id
    ).first()
    if not query_projects:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Project does not exist")
    membership = db.query(models.MemberShip).filter(
        models.MemberShip.workspace_id == query_projects.workspace_id,
        models.MemberShip.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Access denied"
        )
    
    query_tasks = db.query(models.Tasks).filter(models.Tasks.project_id == project_id).all()
    return query_tasks

@router.post("/projects/{project_id}/tasks",status_code=status.HTTP_201_CREATED,response_model=schemas.TaskResponse)
def post_work(task:schemas.CreateTasks,project_id:int,db:Session = Depends(get_db),current_user:int = Depends(oauth.get_current_user)):
    query_projects = db.query(models.Projects).filter(
        models.Projects.id == project_id
    ).first()
    if not query_projects:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Project does not exist")
    membership = db.query(models.MemberShip).filter(
        models.MemberShip.workspace_id == query_projects.workspace_id,
        models.MemberShip.user_id == current_user.id
    ).first()
    if not membership or membership.role != models.UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Access denied"
        )
    if task.assigned_to_user_id:
        assigned_user = db.query(models.MemberShip).filter(
            models.MemberShip.workspace_id == query_projects.workspace_id,
            models.MemberShip.user_id == task.assigned_to_user_id
        ).first()
        if not assigned_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Assigned user is not a member of this workspace",
            )
    tasks = task.model_dump()
    task_data = models.Tasks(**tasks,created_by_user_id = current_user.id,project_id=project_id)
    db.add(task_data)
    db.commit()
    db.refresh(task_data)
    return task_data


@router.get("/tasks/{task_id}",response_model=schemas.TaskResponse)
def get_one_task(task_id:int,db:Session = Depends(get_db),current_user:int = Depends(oauth.get_current_user)):
    query_tasks = db.query(models.Tasks,models.Projects.workspace_id).join(models.Projects,models.Tasks.project_id == models.Projects.id).filter(
        models.Tasks.id == task_id
    ).first()
    if not query_tasks:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Task not found")
    task, workspace_id = query_tasks
    membership = db.query(models.MemberShip).filter(
        models.MemberShip.workspace_id == workspace_id,
        models.MemberShip.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    return task

@router.delete("/tasks/{task_id}",status_code=status.HTTP_204_NO_CONTENT)
def del_task(task_id:int,db:Session = Depends(get_db),current_user:int = Depends(oauth.get_current_user)):
    query_tasks = db.query(models.Tasks,models.Projects.workspace_id).join(models.Projects,models.Tasks.project_id == models.Projects.id).filter(
        models.Tasks.id == task_id
    ).first()
    if not query_tasks:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Task not found")
    task,workspace_id = query_tasks

    membership = db.query(models.MemberShip).filter(
        models.MemberShip.workspace_id == workspace_id,
        models.MemberShip.user_id == current_user.id,
        models.MemberShip.role == models.UserRole.ADMIN
    ).first()
    if not membership:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="You are not allowed to delete")
    db.delete(task)
    db.commit()
    return Response()

@router.put("/tasks/{task_id}",response_model=schemas.TaskResponse)
def edit_tasks(task:schemas.CreateTasks,task_id:int,db:Session = Depends(get_db),current_user:int = Depends(oauth.get_current_user)):
    # Admins can update title, description, priority, due date, and assignee
    # Assigned Employees can update task status (e.g., set to DONE)
    query_tasks = db.query(models.Tasks,models.Projects.workspace_id).join(models.Projects,models.Tasks.project_id == models.Projects.id).filter(
        models.Tasks.id == task_id
    ).first()
    if not query_tasks:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Task not found")
    
    
    tasks,workspace_id = query_tasks
    membership = db.query(models.MemberShip).filter(
        models.MemberShip.workspace_id == workspace_id,
        models.MemberShip.user_id == current_user.id,
        
    ).first()
    if not membership:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="Access not allowed")
    update_task = task.model_dump(exclude_unset=True)
    if membership.role == models.UserRole.ADMIN :
        
        for key,value in update_task.items():
            setattr(tasks, key, value)

    elif membership.role == models.UserRole.EMPLOYEE:
        if tasks.assigned_to_user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="Employees can only update tasks assigned to them"
            )
        if "status" in update_task:
            tasks.status = update_task["status"]
    db.commit()
    db.refresh(tasks)
    return tasks   
