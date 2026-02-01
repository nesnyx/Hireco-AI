from app.repositories._role_repository import RoleRepository


class RoleService:
    def __init__(self, role_repository : RoleRepository):
        self._role_repository = role_repository
        
    def get_role_by_name(self, name: str):
        return self._role_repository.get_role_by_name(name)
    
    def create_role(self, name: str):
        return self._role_repository.save(name)
    
    def assign_role_to_user(self, account_id: str, role_id: str):
        return self._role_repository.assign_role_to_user(account_id, role_id)