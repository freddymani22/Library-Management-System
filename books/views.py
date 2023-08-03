from django.shortcuts import render

# Create your views here.
from .forms import BookCreationForm, MemberCreationForm
from .models import Book, Genre


def index(request):
    books_qs = Book.objects.all()

    return render(request, 'index.html', )


def books_view(request):
    genres = Genre.choices  # This will retrieve the choices from the Genre model

    book_form = BookCreationForm
    context = {'book_form': book_form, 'genres': genres}
    return render(request, 'books.html', context=context)


def member_view(request):
    form = MemberCreationForm
    return render(request, 'members.html', {'form': form})
