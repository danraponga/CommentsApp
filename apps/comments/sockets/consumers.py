import json
import os
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage

from config.settings import FILES_DIR, IMAGES_DIR
from apps.comments.models import Comment
from apps.comments.serializer import CommentSerializer
from asgiref.sync import sync_to_async
from base64 import b64decode


class CommentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("comments", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("comments", self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        image_data = data.get("image", None)
        file_data = data.get("file", None)

        image = None
        if image_data:
            imgformat, imgstr = image_data.split(";base64,")
            ext = imgformat.split("/")[-1]
            image = ContentFile(
                b64decode(imgstr), name=f'image_{data["username"]}.{ext}'
            )
            image = await sync_to_async(default_storage.save)(
                IMAGES_DIR / image.name, image
            )

        file = None
        if file_data:
            fileformat, filestr = file_data.split(";base64,")
            ext = fileformat.split("/")[-1]
            file = ContentFile(
                b64decode(filestr), name=f'file_{data["username"]}.{ext}'
            )
            file = await sync_to_async(default_storage.save)(
                FILES_DIR / file.name, file
            )

        comment = await sync_to_async(Comment.objects.create)(
            username=data["username"],
            email=data["email"],
            homepage=data.get("homepage", ""),
            text=data["text"],
            parent_id=data.get("parent_id"),
            image=image,
            file=file,
        )

        comment_data = CommentSerializer(comment).data

        await self.channel_layer.group_send(
            "comments", {"type": "comment_message", "comment": comment_data}
        )

    async def comment_message(self, event):
        await self.send(text_data=json.dumps({"comment": event["comment"]}))
