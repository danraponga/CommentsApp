import json
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from apps.comments.utils import save_base64file
from config.settings import FILES_DIR, IMAGES_DIR, MEDIA_ROOT
from apps.comments.models import Comment
from apps.comments.serializer import CommentSerializer
from apps.comments.forms import CommentForm


class CommentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("comments", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("comments", self.channel_name)

    async def receive(self, text_data):
        form = CommentForm(json.loads(text_data))
        if not await sync_to_async(form.is_valid)():
            errors = json.loads(form.errors.as_json())
            print(errors, type(errors))
            await self.send(text_data=json.dumps({"errors": errors}))
            return

        data = form.cleaned_data
        image = data.get("image", None)
        file = data.get("file", None)

        if image:
            image = save_base64file(
                path=IMAGES_DIR, base_str=image, username=data["username"]
            )
            print(image)

        if file:
            file = save_base64file(
                path=FILES_DIR, base_str=file, username=data["username"]
            )

        comment = await sync_to_async(Comment.objects.create)(
            username=data["username"],
            email=data["email"],
            homepage=data.get("homepage", None),
            text=data["text"],
            parent_id=data.get("parent_id", None),
            image=image,
            file=file,
        )

        comment_data = CommentSerializer(comment).data
        await self.channel_layer.group_send(
            "comments", {"type": "comment_message", "comment": comment_data}
        )

    async def comment_message(self, event):
        await self.send(text_data=json.dumps({"comment": event["comment"]}))
