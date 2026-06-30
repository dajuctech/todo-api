from sqlalchemy.orm import Session

from app.models import Task, User
from app.schemas import TaskCreate, TaskUpdate, UserCreate
from app.security import get_password_hash


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user: UserCreate) -> User:
    db_user = User(
        email=user.email,
        hashed_password=get_password_hash(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_task(db: Session, task: TaskCreate, owner_id: int) -> Task:
    db_task = Task(
        title=task.title,
        description=task.description,
        priority=task.priority,
        due_date=task.due_date,
        owner_id=owner_id,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def get_tasks(
    db: Session,
    owner_id: int,
    completed: bool | None = None,
    search: str | None = None,
    skip: int = 0,
    limit: int = 100,
) -> list[Task]:
    query = db.query(Task).filter(Task.owner_id == owner_id)

    if completed is not None:
        query = query.filter(Task.completed == completed)

    if search:
        query = query.filter(Task.title.ilike(f"%{search}%"))

    return query.offset(skip).limit(limit).all()


def get_task(db: Session, task_id: int, owner_id: int) -> Task | None:
    return db.query(Task).filter(Task.id == task_id, Task.owner_id == owner_id).first()


def update_task(
    db: Session,
    task_id: int,
    owner_id: int,
    updates: TaskUpdate,
) -> Task | None:
    db_task = get_task(db, task_id, owner_id)
    if not db_task:
        return None
    for field, value in updates.model_dump(exclude_unset=True).items():
        setattr(db_task, field, value)
    db.commit()
    db.refresh(db_task)
    return db_task


def complete_task(db: Session, task_id: int, owner_id: int) -> Task | None:
    db_task = get_task(db, task_id, owner_id)
    if not db_task:
        return None
    db_task.completed = True
    db.commit()
    db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int, owner_id: int) -> bool:
    db_task = get_task(db, task_id, owner_id)
    if not db_task:
        return False
    db.delete(db_task)
    db.commit()
    return True
