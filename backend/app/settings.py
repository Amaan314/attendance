from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Loads environment variables from the .env file."""
    database_url: str
    redis_url: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int

    class Config:
        env_file = ".\.env"

settings = Settings()
