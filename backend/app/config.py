from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    app_name: str = "KBA - Knowledge Base AI"
    app_version: str = "1.0.0"
    debug: bool = True

    # Gemini
    gemini_api_key: str = ""
    gemini_project_id: str = ""

    # MongoDB
    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db_name: str = "kba_db"

    # Chroma Cloud
    chroma_api_key: str = ""
    chroma_tenant: str = ""
    chroma_database: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
