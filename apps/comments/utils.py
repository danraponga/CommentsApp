from io import BytesIO
from base64 import b64decode, b64encode
from PIL import Image
from html.parser import HTMLParser
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

    if image.size <= max_size:
        image.close()
        return base_str

    resized_image = image.resize(max_size)
    buffer = BytesIO()
    resized_image.save(buffer, format=image.format)
    resized_image.close()

    base_content = b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/{image_data['extension']};base64,{base_content}"


def save_base64file(
    base_str: str, username: str, path: PosixPath
) -> ContentFile:
    file_data = decode_base64(base_str)
    filename = get_valid_filename(f"{username}.{file_data['extension']}")
    file = ContentFile(file_data["content"], name=filename)
    return default_storage.save(path / file.name, file)


class TagValidator(HTMLParser):
    def __init__(self, allowed_tags, allowed_attrs):
        super().__init__()
        self.stack = []
        self.allowed_tags = allowed_tags
        self.allowed_attrs = allowed_attrs

    def handle_starttag(self, tag, attrs):
        if tag not in self.allowed_tags:
            msg = ", ".join(self.allowed_tags)
            raise TypeError(f"This tag is not supported. Supported tags: {msg}")
        for attr in attrs:
            if attr[0] not in self.allowed_attrs[tag]:
                msg = ", ".join(self.allowed_attrs[tag])
                raise TypeError(f"This tag supports only these attributes: {msg}")
        if not tag.endswith("/"):
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if self.stack and self.stack[-1] == tag:
            self.stack.pop()
        else:
            raise TypeError("Wrong tags subsequence or unclosed tag.")
