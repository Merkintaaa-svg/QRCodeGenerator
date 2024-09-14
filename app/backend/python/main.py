import asyncio
from fastapi import FastAPI, HTTPException, Form, BackgroundTasks
from fastapi.responses import FileResponse
import qrcode
import os
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешить запросы с любых доменов, можно настроить список доменов
    allow_credentials=True,
    allow_methods=["*"],  # Разрешить все методы, если хочешь ограничить, можешь указать "POST", "GET"
    allow_headers=["*"],
)

# Путь для сохранения QR-кодов
QR_CODES_DIR = "qrcodes"
os.makedirs(QR_CODES_DIR, exist_ok=True)

# Функция для удаления файла с задержкой
async def delete_file_with_delay(filepath: str, delay: int = 60):
    """
    Удаляет файл спустя некоторое время (delay секунд) после его создания.
    """
    await asyncio.sleep(delay)
    if os.path.exists(filepath):
        os.remove(filepath)
        print(f"Файл {filepath} был удален.")
    else:
        print(f"Файл {filepath} не найден для удаления.")

@app.post("/api/generate/")
async def generate_qr(text: str = Form(...)):
    """
    Принимает текст или ссылку и генерирует QR-код.
    QR-код сохраняется на сервере и возвращает путь к нему.
    """
    try:
        # Генерация QR-кода
        img = qrcode.make(text)
        filename = f"qr_{datetime.now().strftime('%Y%m%d%H%M%S')}.png"
        filepath = os.path.join(QR_CODES_DIR, filename)
        img.save(filepath)
        return {"filename": filename, "url": f"/api/download/{filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/download/{filename}")
async def download_qr(filename: str, background_tasks: BackgroundTasks):
    """
    Позволяет пользователю скачать QR-код по его имени файла и удаляет файл спустя некоторое время.
    """
    filepath = os.path.join(QR_CODES_DIR, filename)
    
    if os.path.exists(filepath):
        # Добавляем задачу на удаление файла через 60 секунд после скачивания
        background_tasks.add_task(delete_file_with_delay, filepath, delay=60)
        # Отправляем файл пользователю
        return FileResponse(filepath, media_type="image/png", filename=filename)
    else:
        raise HTTPException(status_code=404, detail="QR-код не найден")
