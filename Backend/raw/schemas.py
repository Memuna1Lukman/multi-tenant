from pydantic import BaseModel,EmailStr
from typing import Optional
from datetime import datetime


class TokenData(BaseModel):
    id: Optional[int]= None

class UserResponse(BaseModel):
    id: Optional[int] = None
    email: str
    full_name: str
    created_at : Optional[datetime] = None
    updated_at : Optional[datetime] = None



class UserInputs(BaseModel):
    id: Optional[int] = None
    email: str
    password_hash: str
    full_name: str
    avatar_url:str
    model_config = {"from_attributes": True}

class CreateWorkSpace(BaseModel):
    id: Optional[int] = None
    name: str
    created_at : Optional[datetime] = None
    updated_at : Optional[datetime] = None
    model_config = {"from_attributes": True}

class WorkSpaceRes(BaseModel):
    name: str
    created_at : Optional[datetime] = None
    updated_at : Optional[datetime] = None


class ListAllMembers(BaseModel):
    id: Optional[int] = None 
    user_id: int
    workspace_id:int
    role: str
    joined_at: Optional[datetime] = None  

class CreateProject(BaseModel):
    id: Optional[int] = None
    workspace_id: int
    name: str
    description:str
    status: Optional[str] = None
    created_by_user_id = Optional[int] = None
    created_at : Optional[datetime] = None
    updated_at : Optional[datetime] = None
    model_config = {"from_attributes": True}  

class ProjectResponse(BaseModel):
    id: Optional[int] = None
    workspace_id: int
    name: str
    description:str
    status: Optional[str] = None
    created_by_user_id = Optional[int] = None
    created_at : Optional[datetime] = None
    updated_at : Optional[datetime] = None 


class CreateTasks(BaseModel):
    id: Optional[int] = None
    project_id : int
    title:str
    description:str
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to_user_id = Optional[int] = None
    created_by_user_id = Optional[int] = None
    due_date = Optional[datetime] = None
    created_at : Optional[datetime] = None
    updated_at : Optional[datetime] = None 
    model_config = {"from_attributes": True} 


class TaskResponse(BaseModel):
    project_id : int
    title:str
    description:str
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to_user_id = Optional[int] = None
    created_by_user_id = Optional[int] = None
    due_date = Optional[datetime] = None
    created_at : Optional[datetime] = None


class CreateComment(BaseModel):
    id: Optional[int] = None
    task_id: int
    author_user_id: int
    body: str
    created_at : Optional[datetime] = None
    updated_at : Optional[datetime] = None 
    model_config = {"from_attributes": True}   

class CommentResponse(BaseModel):
    id: Optional[int] = None
    task_id: int
    author_user_id: int
    body: str
    created_at : Optional[datetime] = None
    updated_at : Optional[datetime] = None   