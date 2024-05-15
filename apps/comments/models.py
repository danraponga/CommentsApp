from django.db import models
from django.utils.translation import gettext_lazy as _
from config.settings import IMAGES_DIR, FILES_DIR


class Comment(models.Model):
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="children"
    )
    text = models.TextField(_("Comment text"))
    created_at = models.DateTimeField(_("Created at"), auto_now_add=True)
    image = models.ImageField(_("Image"), upload_to=IMAGES_DIR, blank=True, null=True)
    file = models.FileField(_("File"), upload_to=FILES_DIR, blank=True, null=True)
    email = models.EmailField(_("Email"))
    username = models.CharField(_("Username"), max_length=32)
    homepage = models.URLField(_("Homepage"), blank=True, null=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("Comment")
        verbose_name_plural = _("Comments")
