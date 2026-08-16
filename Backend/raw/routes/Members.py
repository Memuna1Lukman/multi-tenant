from fastapi import APIRouter,HTTPException,status,Depends,Response
from .. import models,oauth,schemas
from ..database  import get_db
from sqlalchemy.orm import Session
from typing import List

router = APIRouter(
    prefix="/workspaces/{workspace_id}",
    tags=["Members"]
)

@router.get("/members",response_model=List[schemas.ListAllMembers])
def get_all_members(workspace_id:int,db:Session = Depends(get_db),current_user:models.Users = Depends(oauth.get_current_user)):
    membership = db.query(models.MemberShip).filter(
        models.MemberShip.user_id == current_user.id,
        models.MemberShip.workspace_id == workspace_id).first()
    if not membership:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="Access Denied")
    all_members = db.query(models.MemberShip).filter(models.MemberShip.workspace_id == workspace_id).all()

    return all_members


@router.delete("/members/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def del_user(user_id:int,workspace_id:int,db:Session = Depends(get_db),current_user:models.Users = Depends(oauth.get_current_user)):
    # check if the person doing the removing is an admin?
    query_admin = db.query(models.MemberShip).filter(
        models.MemberShip.user_id == current_user.id,
        models.MemberShip.workspace_id == workspace_id,
        models.MemberShip.role == models.UserRole.ADMIN
        
    ).first()
    if not query_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="Only workspace Admins can remove members")
    # targeted users to be removed
    target_users = db.query(models.MemberShip).filter(
        models.MemberShip.user_id == user_id,
        models.MemberShip.workspace_id == workspace_id
    )
    # Admins cannot leave or be removed
    if not target_users:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Not found")
    if target_users.role == models.UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Admin cannot be removed")
    
    db.delete(target_users)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)



@router.post("/")
def add_members(db:Session = Depends(get_db),current_user: models.Users = Depends(oauth.get_current_user)):

    db.add()
    db.commit()
    db.refresh()