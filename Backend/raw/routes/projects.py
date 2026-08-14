from fastapi import APIRouter,HTTPException,status,Depends,Response
from .. import models,oauth,schemas
from ..database  import get_db
from sqlalchemy.orm import Session
from typing import List

router = APIRouter(
    tags=['Projects']
)

@router.get("/workspaces/{workspace_id}/projects")
def get_all_projects(workspace_id:int,db:Session = Depends(get_db),current_user:int = Depends(oauth.get_current_user)):
    # list all the projects in a workspace
    # i have to know if  the user is in this workspace,
    #  i have to also know if the workspace exist
    # and also 
    workspace = db.query(models.WorkSpace).filter(
        # models.WorkSpace.user_id == current_user.id,
        models.WorkSpace.workspace_id == workspace_id
    ).first()
    if not workspace:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="Not allowed")
    membership = db.query(models.MemberShip).filter(
        models.MemberShip.workspace_id == workspace_id,
        models.MemberShip.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="Access denied")
    projects = db.query(models.Projects).filter(
        models.Projects.workspace_id == workspace_id
    ).all()
    return projects


@router.post("/workspaces/{workspace_id}/projects",status_code=status.HTTP_201_CREATED,response_model=schemas.ProjectResponse)
def create_project(workspace_id:int,project:schemas.CreateProject,db:Session = Depends(get_db),current_user:int = Depends(oauth.get_current_user)):
    # first check if the workspace exist and the one posting is an ADMIN
    query_workspace = db.query(models.WorkSpace).filter(
        models.WorkSpace.id == workspace_id
    ).first()
    if not query_workspace:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Workspace not found")
    query_members = db.query(models.MemberShip).filter(
        models.MemberShip.workspace_id == workspace_id,
        models.MemberShip.user_id == current_user.id,
        models.MemberShip.user_id == models.UserRole.ADMIN
    ).first()
    if not query_members:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="You are not an Admin")


    # Now add this to the projects table
    projects = project.model_dump()

    project_data = models.Projects(**projects,created_by_user_id = current_user.id,workspace_id = workspace_id)
    db.add(project_data)
    db.commit()
    db.refresh(project_data)
    return project_data


@router.get("/projects/{project_id}",response_model=schemas.ProjectResponse)
def get_one_projects(project_id:int,db:Session = Depends(get_db),current_user:int = Depends(oauth.get_current_user)):
    query_projects = db.query(models.Projects).filter(
        models.Projects.id == project_id
    ).first()
    if not query_projects:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Not found")
    membership = db.query(models.MemberShip).filter(
        models.MemberShip.workspace_id == query_projects.workspace_id,
        models.MemberShip.user_id == current_user.id
    ).first()
    if not membership:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return query_projects

@router.put("/projects/{project_id}",response_model=schemas.ProjectResponse)
def edit_project(project_id:int,project:schemas.CreateProject,db:Session = Depends(get_db),current_user:int = Depends(oauth.get_current_user)):
    query_project = db.query(models.Projects).filter(
            models.Projects.id == project_id
        )
    projects = query_project.first()
    if not projects:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="project not found")
    query_membership = db.query(models.MemberShip).filter(
        models.MemberShip.workspace_id == projects.workspace_id,
        models.MemberShip.user_id == current_user.id,
        models.MemberShip.role == models.UserRole.ADMIN
    ).first()
    if not query_membership:
          raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="Access not allowed")
      
    
    update_project = project.model_dump(exclude_unset=True)
    query_project.update(update_project,synchronize_session=False)
    db.commit()
    db.refresh(projects)
    return projects

@router.delete("/projects/{project_id}",status_code=status.HTTP_204_NO_CONTENT)
def del_project(project_id:int,db:Session = Depends(get_db),current_user:int = Depends(oauth.get_current_user)):
    # check whether the person is an admin
    query_project = db.query(models.Projects).filter(
        models.Projects.id == project_id
    ).first()
    query_member = db.query(models.MemberShip).filter(
        models.MemberShip.workspace_id == query_project.workspace_id,
        models.MemberShip.user_id == current_user.id,
        models.MemberShip.role == models.UserRole.ADMIN
    ).first()
    if not query_member:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="You are not allowed to delete")
   
    
    db.delete(query_project)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

