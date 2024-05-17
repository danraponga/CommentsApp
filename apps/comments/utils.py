from io import BytesIO
from base64 import b64decode, b64encode
from PIL import Image
from django.core.files.base import ContentFile
from django.utils.text import get_valid_filename
from django.core.files.storage import default_storage
from pathlib import PosixPath


def decode_base64(base64_string) -> bool:
    format_, string = base64_string.split(";base64,")
    extension = format_.split("/")[-1].lower()
    content = b64decode(string)
    return {"extension": extension, "content": content}


def resize_image_if_needed(base_str, max_size: tuple[int, int]) -> str:
    image_data = decode_base64(base_str)
    image = Image.open(BytesIO(image_data["content"]))

    if (image.height, image.width) <= max_size:
        image.close()
        return base_str

    image.thumbnail(max_size)
    buffer = BytesIO()
    image.save(buffer, format=image.format)

    base_content = b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/{image_data['extension']};base64,{base_content}"


def save_base64file(
    base_str: str, username: str, path: PosixPath
) -> ContentFile:
    file_data = decode_base64(base_str)
    filename = get_valid_filename(f"{username}.{file_data['extension']}")
    file = ContentFile(file_data["content"], name=filename)
    return default_storage.save(path / file.name, file)
