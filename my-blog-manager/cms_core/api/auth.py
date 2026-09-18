import os
import json
import hashlib
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

# 密码配置文件（放在 my-blog-manager 目录下）
ADMIN_CONFIG_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    'admin_config.json'
)

DEFAULT_PASSWORD = '123456'


def _load_config() -> dict:
    if os.path.exists(ADMIN_CONFIG_FILE):
        try:
            with open(ADMIN_CONFIG_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            pass
    return {}


def _save_config(cfg: dict):
    with open(ADMIN_CONFIG_FILE, 'w', encoding='utf-8') as f:
        json.dump(cfg, f, ensure_ascii=False, indent=2)


def _hash(password: str) -> str:
    return hashlib.sha256(('xinghui::' + password).encode('utf-8')).hexdigest()


class LoginBody(BaseModel):
    password: str


class ChangeBody(BaseModel):
    oldPassword: str
    newPassword: str


@router.get("/status")
def auth_status():
    cfg = _load_config()
    stored = cfg.get('adminPassword')
    return {
        "locked": True,
        "hasPassword": bool(stored),
        "isDefault": (not stored) or stored == _hash(DEFAULT_PASSWORD)
    }


@router.post("/login")
def auth_login(body: LoginBody):
    cfg = _load_config()
    expected = cfg.get('adminPassword') or _hash(DEFAULT_PASSWORD)
    if _hash(body.password) == expected:
        return {"success": True, "message": "登录成功"}
    return {"success": False, "message": "密码错误"}


@router.post("/change")
def auth_change(body: ChangeBody):
    cfg = _load_config()
    expected = cfg.get('adminPassword') or _hash(DEFAULT_PASSWORD)
    if _hash(body.oldPassword) != expected:
        return {"success": False, "message": "当前密码错误"}
    if not body.newPassword or len(body.newPassword) < 4:
        return {"success": False, "message": "新密码至少 4 位"}
    cfg['adminPassword'] = _hash(body.newPassword)
    _save_config(cfg)
    return {"success": True, "message": "密码已修改"}
