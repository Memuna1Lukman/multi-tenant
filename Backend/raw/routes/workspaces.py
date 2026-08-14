from fastapi import APIRouter,HTTPException,status,Depends,Response
from .. import models,oauth,schemas
from ..database  import get_db
from sqlalchemy.orm import Session
from typing import List

router = APIRouter(
    prefix="/workspaces",
    tags=["WorkSpaces"]
)


@router.post("/",status_code=status.HTTP_201_CREATED,response_model=schemas.WorkSpaceRes)
def create_workspace(work:schemas.CreateWorkSpace,db:Session = Depends(get_db),current_user:int = Depends(oauth.get_current_user)):
    work_space = work.model_dump()
    
    work_space_data = models.WorkSpace(**work_space)
    db.add(work_space_data)
    db.flush()
   

    new_membership = models.MemberShip(
        user_id = current_user.id,
        workspace_id = work_space_data.id,
        role = models.UserRole.ADMIN
    )
    db.add(new_membership)
    db.commit()
    db.refresh(work_space_data)
    return work_space_data


@router.get("/",response_model=List[schemas.WorkSpaceRes])
def get_all_user_workspace(db:Session = Depends(get_db),current_user:int = Depends(oauth.get_current_user)):
    get_work_space = db.query(models.WorkSpace).join(models.MemberShip,models.WorkSpace.id == models.MemberShip.workspace_id).filter(
        models.MemberShip.user_id == current_user.id
    ).all()
    return get_work_space


@router.get("/{workspace_id}",response_model=schemas.WorkSpaceRes)
def get_one_workspace(workspace_id:int,db:Session = Depends(get_db),current_user:int = Depends(oauth.get_current_user)):
    query_membership = db.query(models.MemberShip).filter(
        models.MemberShip.workspace_id == workspace_id,
        models.MemberShip.user_id == current_user.id
    ).first()
    if not query_membership:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workspace not found or access denied"
        )
    query_workspace = db.query(models.WorkSpace).filter(models.WorkSpace.id == workspace_id).first()
    if query_workspace is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"{workspace_id} is not found")
    return query_workspace

@router.put("/{workspace_id}",response_model=schemas.CreateWorkSpace)
def edit_workspace(work:schemas.CreateWorkSpace,workspace_id:int,db:Session = Depends(get_db),current_user:int = Depends(oauth.get_current_user)):
    membership = db.query(models.MemberShip).filter(
        models.MemberShip.workspace_id == workspace_id,
        models.MemberShip.user_id == current_user.id,
        models.MemberShip.role == models.UserRole.ADMIN
    ).first()
    if not membership:
        raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to edit this workspace"
            )
    query_workspace = db.query(models.WorkSpace).filter(models.WorkSpace.id == workspace_id)
    get_query = query_workspace.first()

    if get_query is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"{workspace_id} is not found")
    updated_data = work.model_dump(exclude_unset=True)
    query_workspace.update(updated_data,synchronize_session=False)
    db.commit()
    return get_query


@router.delete("/{workspace_id}",status_code=status.HTTP_204_NO_CONTENT)
def del_workspace(workspace_id:int,db:Session = Depends(get_db),current_user:int = Depends(oauth.get_current_user)):
    query_role = db.query(models.MemberShip).filter(
        models.MemberShip.workspace_id == workspace_id,
        models.MemberShip.user_id == current_user.id,
        models.MemberShip.role == models.UserRole.ADMIN).first()
    if query_role is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="you are not an admin")
    delete_workspace = db.query(models.WorkSpace).filter(models.WorkSpace.id == workspace_id).first()
    if delete_workspace is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=f"{workspace_id} is not found")
    db.delete(delete_workspace)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)