import os
import json

LAST_READ_FILE = os.path.join("data", "last_read.json")

def save_book_to_folder(title, chapters):
    base_path = os.path.join("stories", title)
    os.makedirs(base_path, exist_ok=True)

    existing_vols = [d for d in os.listdir(base_path) if d.startswith("vol")]
    next_vol_index = len(existing_vols) + 1
    vol_path = os.path.join(base_path, f"vol{next_vol_index}")
    os.makedirs(vol_path, exist_ok=True)

    index_json = []

    for i, (chapter_title, chapter_html) in enumerate(chapters):
        filename = f"chapter_{i+1:03}.html"
        filepath = os.path.join(vol_path, filename)

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(chapter_html)

        index_json.append({
            "title": chapter_title,
            "vol": f"vol{next_vol_index}",
            "file": filename
        })

    index_path = os.path.join(base_path, "index.json")
    with open(index_path, "a", encoding="utf-8") as f:
        for entry in index_json:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")

    return index_json

def load_last_read():
    if os.path.exists(LAST_READ_FILE):
        with open(LAST_READ_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def save_last_read(title, chapter_id):
    data = load_last_read()
    data[title] = chapter_id
    with open(LAST_READ_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)