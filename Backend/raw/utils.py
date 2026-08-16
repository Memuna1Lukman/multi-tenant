from pwdlib import PasswordHash
import secrets

password_hash = PasswordHash.recommended()

def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)


def get_password_hash(password):
    return password_hash.hash(password)


def email_token():
    create_token = secrets.token_urlsafe(32)
    return create_token


