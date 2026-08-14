from fastapi import HTTPException,Depends,status,APIRouter
from .. import models,utils,schemas,oauth
from ..database import get_db
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

router = APIRouter(
    tags=["Users"],
    prefix="/users"
)

@router.post("/",status_code=status.HTTP_201_CREATED,response_model=schemas.UserResponse)
def create_new_user(user:schemas.UserInputs,db:Session = Depends(get_db)):
    user_model = user.model_dump()
    user_model["password_hash"] = utils.get_password_hash(user.password_hash)
    user_data = models.Users(**user_model)
    try:
        db.add(user_data)
        db.commit()
        db.refresh(user_data)
        return user_data
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Registration failed. Email or Username is already taken.")


@router.get("/me",response_model=schemas.UserResponse)
def get_me(db:Session = Depends(get_db),current_user:int = Depends(oauth)):
    query_user = db.query(models.Users).filter(
        models.Users.id == current_user.id
    )
    if not query_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Not Found")
    return query_user


