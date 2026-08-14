from enum import Enum as PyEnum
from sqlalchemy import (
    Column,
    String,
    Integer,
    ForeignKey,
    DateTime,
    Enum as SQLEnum,
    UniqueConstraint,
    Text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


# --- ENUMS ---

class UserRole(str, PyEnum):
    ADMIN = "ADMIN"
    EMPLOYEE = "EMPLOYEE"


class ProjectStatus(str, PyEnum):
    ACTIVE = "ACTIVE"
    ARCHIVED = "ARCHIVED"
    COMPLETED = "COMPLETED"


class TaskStatus(str, PyEnum):
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    REVIEW = "REVIEW"
    DONE = "DONE"


class TaskPriority(str, PyEnum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"


# --- MODELS ---

class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True, default=None)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    memberships = relationship("MemberShip", back_populates="user", cascade="all, delete-orphan")
    assigned_tasks = relationship("Tasks", foreign_keys="[Tasks.assigned_to_user_id]", back_populates="assigned_to")
    created_tasks = relationship("Tasks", foreign_keys="[Tasks.created_by_user_id]", back_populates="created_by")
    comments = relationship("Comments", back_populates="author", cascade="all, delete-orphan")


class WorkSpace(Base):
    __tablename__ = "workspace"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    memberships = relationship("MemberShip", back_populates="workspace", cascade="all, delete-orphan")
    projects = relationship("Projects", back_populates="workspace", cascade="all, delete-orphan")
    invites = relationship("Invites", back_populates="workspace", cascade="all, delete-orphan")


class MemberShip(Base):
    __tablename__ = "membership"

    __table_args__ = (
        UniqueConstraint("user_id", "workspace_id", name="uq_user_workspace"),
    )

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    workspace_id = Column(Integer, ForeignKey("workspace.id", ondelete="CASCADE"), nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.EMPLOYEE)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("Users", back_populates="memberships")
    workspace = relationship("WorkSpace", back_populates="memberships")


class Projects(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True)
    workspace_id = Column(Integer, ForeignKey("workspace.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(SQLEnum(ProjectStatus), nullable=False, default=ProjectStatus.ACTIVE)
    created_by_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    workspace = relationship("WorkSpace", back_populates="projects")
    tasks = relationship("Tasks", back_populates="project", cascade="all, delete-orphan")


class Tasks(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(SQLEnum(TaskStatus), nullable=False, default=TaskStatus.TODO)
    priority = Column(SQLEnum(TaskPriority), nullable=False, default=TaskPriority.LOW)
    assigned_to_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_by_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    due_date = Column(DateTime(timezone=True), nullable=True, default=None)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    project = relationship("Projects", back_populates="tasks")
    assigned_to = relationship("Users", foreign_keys=[assigned_to_user_id], back_populates="assigned_tasks")
    created_by = relationship("Users", foreign_keys=[created_by_user_id], back_populates="created_tasks")
    comments = relationship("Comments", back_populates="task", cascade="all, delete-orphan")


class Comments(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    author_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    body = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    task = relationship("Tasks", back_populates="comments")
    author = relationship("Users", back_populates="comments")


class Invites(Base):
    __tablename__ = "invites"

    id = Column(Integer, primary_key=True)
    workspace_id = Column(Integer, ForeignKey("workspace.id", ondelete="CASCADE"), nullable=False)
    email = Column(String, nullable=False, index=True)
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.EMPLOYEE)
    token = Column(String, unique=True, nullable=False, index=True)
    invited_by_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    accepted_at = Column(DateTime(timezone=True), nullable=True, default=None)

    # Relationships
    workspace = relationship("WorkSpace", back_populates="invites")