import os
import json

def save_book_to_folder(title, chapters):
    base_path = os.path.join('stories', title)
    vol = 'vol1'
    vol_path = os.path.join(base_path, vol)
    os.makedirs(vol_path, exist_ok=True)

    index_path = os.path.join(base_path, 'index.json')
    with open(index_path, 'w', encoding='utf-8') as index_file:
        for idx, (chap_title, chap_html) in enumerate(chapters):
            file_name = f"chapter_{idx+1:03}.html"
            file_path = os.path.join(vol_path, file_name)

            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(chap_html)

            index_entry = {
                "title": chap_title,
                "vol": vol,
                "file": file_name
            }
            index_file.write(json.dumps(index_entry, ensure_ascii=False) + '\n')

    print(f"[DEBUG] Đã lưu {len(chapters)} chương cho truyện '{title}'")
