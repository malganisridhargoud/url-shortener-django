from django.db import models

# for url model

import random
import string

# to generate a random set of characters and numbers for a shorter url
def generate_short_code():
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(6))

# shortened url model
from django.contrib.auth.models import User

class ShortenedURL(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    long_url = models.URLField()
    short_code = models.CharField(max_length=10, unique=True, default=generate_short_code)
    created_at = models.DateTimeField(auto_now_add=True)

# visual showcase of shortcode changed to longurl
def __str__(self):
        return f"{self.short_code} => {self.long_url}"
