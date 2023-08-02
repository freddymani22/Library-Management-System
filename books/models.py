from django.db import models
from django.db.models.signals import pre_save, post_save
from django.db.models import Q
# Create your models here.


class Genre(models.TextChoices):
    FICTION = 'Fiction'
    NON_FICTION = 'Non-Fiction'
    MYSTERY = 'Mystery'
    ROMANCE = 'Romance'
    FANTASY = 'Fantasy'
    SCIENCE_FICTION = 'Science Fiction',
    SCIENCE = 'Science',
    HORROR = 'Horror'
    THRILLER = 'Thriller'
    BIOGRAPHY = 'Biography'
    HISTORY = 'History'
    POETRY = 'Poetry'
    DRAMA = 'Drama'
    COMEDY = 'Comedy'
    CHILDREN = 'Children'
    SELF_HELP = 'Self-Help'
    RELIGION_SPIRITUALITY = 'Religion/Spirituality'
    COOKBOOK = 'Cookbook'
    TRAVEL = 'Travel'
    ART = 'Art'
    SPORTS = 'Sports'
    OTHER = 'Other'


class BookQuerySet(models.QuerySet):
    def search(self, query):
        lookup = Q(title__icontains=query) | Q(
            author__icontains=query) | Q(genre__icontains=query)
        return self.filter(lookup)


class BookCustomManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        return BookQuerySet(self.model, using=self._db)

    def search(self, query):
        return self.get_queryset().search(query)


class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    genre = models.CharField(
        max_length=30,
        choices=Genre.choices,
        default=Genre.OTHER,
    )
    isbn = models.CharField(max_length=200)
    availability_status = models.BooleanField(default=True)
    objects = BookCustomManager()

    def __str__(self):
        return self.title


class Member(models.Model):
    member = models.CharField(max_length=100, unique=True)
    email = models.EmailField()

    def __str__(self):
        return self.member


class BookStatus(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    borrowed_date = models.DateField(auto_now_add=True)
    returned = models.BooleanField()


# class BorrowedBook(models.Model):
#     book = models.ForeignKey(Book, on_delete=models.CASCADE)
#     member = models.ForeignKey(Member, on_delete=models.CASCADE)
#     borrowed_date = models.DateField(null=True, blank=True, auto_now_add=True)

#     def __str__(self):
#         return f'{self.book}-{self.member}-{self.borrowed_date}'


# class ReturnedBook(models.Model):
#     book_detail = models.ForeignKey(BorrowedBook, on_delete=models.CASCADE)
#     returned_date = models.DateField(null=True, blank=True)


# def book_borrowed_update_availability_status(instance, *args, **kwargs):
#     book_obj = Book.objects.get(id=instance.book.id)
#     book_obj.availability_status = False
#     book_obj.save()
#     print(instance.book.availability_status)


# pre_save.connect(book_borrowed_update_availability_status, sender=BorrowedBook)


# def book_returned_update_availability_status(instance, *args, **kwargs):
#     print(instance.__dict__)
#     book_obj = Book.objects.get(id=BorrowedBook.objects.get(
#         id=instance.book_detail_id).book.id)
#     book_obj.availability_status = True
#     book_obj.save()


# pre_save.connect(book_returned_update_availability_status, sender=ReturnedBook)


def book_status_update(instance, *args, **kwargs):
    if instance.returned == False:
        book_obj = Book.objects.get(id=instance.book.id)
        book_obj.availability_status = False
        book_obj.save()
        print(instance.book.availability_status)
    else:
        book_obj = Book.objects.get(id=instance.book.id)
        book_obj.availability_status = True
        book_obj.save()
        print(instance.book.availability_status)


pre_save.connect(book_status_update, sender=BookStatus)
