from __future__ import annotations

from fastapi.exceptions import HTTPException


class NotFoundException(HTTPException):
    def __init__(self, field_name: str):
        super().__init__(
            status_code=404,
            detail=f"{field_name} not found"
        )
