from flask import Flask, render_template, request, redirect, url_for
from utils.epub_parser import parse_epub
from utils.save_helper import save_book_to_folder
import os
import json

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
STORY_FOLDER = 'stories'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def load_index(title):
    index_path = os.path.join(STORY_FOLDER, title, 'index.json')
    chapters = []
    if os.path.exists(index_path):
        with open(index_path, 'r', encoding='utf-8') as f:
            for line in f:
                chapters.append(json.loads(line.strip()))
    return chapters

@app.route('/')
def index():
    books = []
    if os.path.exists(STORY_FOLDER):
        books = [d for d in os.listdir(STORY_FOLDER) if os.path.isdir(os.path.join(STORY_FOLDER, d))]
    return render_template('Home.html', books=books)

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    if file and file.filename.endswith('.epub'):
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        file.save(save_path)

        title, chapters = parse_epub(save_path)
        save_book_to_folder(title, chapters)
    return redirect(url_for('index'))

@app.route('/book/<title>')
def view_chapters(title):
    chapter_list = load_index(title)
    
    # ✅ In log kiểm tra
    print(f"[DEBUG] Loaded {len(chapter_list)} chapters for: {title}")
    for i, chap in enumerate(chapter_list):
        print(f"{i}: {chap}")

    return render_template('ChapterList.html', title=title, chapters=chapter_list)


@app.route('/book/<title>/<int:chapter_id>')
def read_chapter(title, chapter_id):
    chapter_list = load_index(title)
    if chapter_id >= len(chapter_list):
        return "Chương không tồn tại", 404

    chap_info = chapter_list[chapter_id]
    file_path = os.path.join(STORY_FOLDER, title, chap_info['vol'], chap_info['file'])

    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    return render_template('read.html',
                           title=title,
                           chapter=html,
                           chapter_title=chap_info['title'],
                           chapter_id=chapter_id,
                           chapter_list=[c['title'] for c in chapter_list])

if __name__ == '__main__':
    app.run(debug=True)
