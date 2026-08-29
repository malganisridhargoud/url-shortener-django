from django.db import models

class URLshort(models.Model):
    url = models.URLField(max_length=200)
    slug = models.CharField(max_length=10)

    def __str__(self):
        return f"short URL For {self.url} is {self.slug}"