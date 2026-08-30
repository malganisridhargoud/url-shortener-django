from django.db import models

class URLshort(models.Model):
    url = models.URLField(max_length=200)
    slug = models.CharField(max_length=10)

    def __str__(self):
        return f"short URL For {self.url} is {self.slug}"

class Book(models.Model):
    title = models.CharField(max_length=20)
    author = models.CharField(max_length=10)
    desc = models.TextField(max_length=200)

    def __str__(self):
        return self.title