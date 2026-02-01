from app.helper.error_handling import RoleNotFound, UserNotFound
from app.repositories._role_repository import RoleName
from app.repositories._user_repository import UserRepository
from app.schemas.user_schema import CreateUserSchema
from app.services.role_service import RoleService


class UserService:
    def __init__(self, user_repository : UserRepository, role_service : RoleService):
        self._user_repository = user_repository
        self._role_service = role_service
        
    def create_user(self, payload : CreateUserSchema):
        new_user = self._user_repository.save(payload)
        existing_role = self._role_service.get_role_by_name(RoleName.USER.value)
        if not existing_role:
            raise RoleNotFound()
        self._role_service.assign_role_to_user(
            account_id=new_user.id,
            role_id=existing_role.id
        )
        return new_user

    def find_by_email(self, email :str):
        existing_user = self._user_repository.find_by_email(email)
        if not existing_user:
            raise UserNotFound()
        return existing_user