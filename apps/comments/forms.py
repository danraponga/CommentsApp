from django.forms import IntegerField, ModelForm, ValidationError, Textarea

from apps.comments.models import Comment
from apps.comments.utils import TagValidator, resize_image_if_needed, decode_base64
from config.settings import (
    MAX_IMAGE_SIZE,
    VALID_FILE_EXTENSIONS,
    VALID_IMAGE_EXTENSIONS,
    MAX_FILE_SIZE,
    ALLOWED_TAGS,
    ALLOWED_TAG_ATTRIBUTES
)


class CommentForm(ModelForm):
    parent_id = IntegerField(required=False)

    class Meta:
        model = Comment
        fields = ["parent_id", "username", "email", "homepage","text", "image","file"]
        widgets = {
            "text": Textarea(attrs={"placeholder": "Comment"}),
        }

    def clean_text(self):
        text = self.data.get("text")
        parser = TagValidator(ALLOWED_TAGS, ALLOWED_TAG_ATTRIBUTES)
        try:
            parser.feed(text)
            if parser.stack:
                raise ValidationError(f"Unclosed tag: {parser.stack[0]}")
        except TypeError as e:
            raise ValidationError(str(e))
        return text

    def clean_image(self):
        base_image = self.data.get("image", None)
        if base_image:
            image_data = decode_base64(base_image)
            if image_data["extension"] not in VALID_IMAGE_EXTENSIONS:
                raise ValidationError(
                    f"Only {', '.join(VALID_IMAGE_EXTENSIONS)} images are allowed."
                )
            base_image = resize_image_if_needed(base_image, MAX_IMAGE_SIZE)

        return base_image

    def clean_file(self):
        b64_file = self.data.get("file", None)

        if b64_file:
            file_data = decode_base64(b64_file)
            if file_data["extension"] not in VALID_FILE_EXTENSIONS:
                raise ValidationError(
                    f"Only {', '.join(VALID_FILE_EXTENSIONS)} files are allowed."
                )
            if len(file_data["content"]) > MAX_FILE_SIZE:
                raise ValidationError("File is too large. Max size is 100KB.")
        return b64_file
