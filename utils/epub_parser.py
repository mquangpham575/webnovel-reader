def parse_epub(filepath):
    from ebooklib import epub, ITEM_DOCUMENT
    from bs4 import BeautifulSoup

    book = epub.read_epub(filepath)
    title = book.get_metadata('DC', 'title')[0][0]

    chapter_list = []
    seen_titles = set()

    for item in book.get_items():
        if item.get_type() != ITEM_DOCUMENT:
            continue

        name = item.get_name().lower()
        if 'cover' in name:
            continue

        soup = BeautifulSoup(item.get_content(), 'html.parser')
        body = soup.find('body')
        raw_text = body.get_text(strip=True) if body else ""

        if not body or len(raw_text) < 50:
            continue

        heading = body.find(['h1', 'h2', 'h3'])
        if heading:
            heading_text = heading.get_text(strip=True)
            chapter_title = ' '.join(heading_text.split())  # chuẩn hóa: xóa khoảng trắng dư
        else:
            continue  # bỏ nếu không có heading

        # Bỏ các tiêu đề không cần thiết
        banned_titles = {"information", "table of contents", "shadow slave"}
        if chapter_title.strip().lower() in banned_titles:
            continue

        
        if not chapter_title.lower().startswith("chapter"):
            continue

        # Bỏ nếu đã gặp tiêu đề tương tự (không phân biệt hoa thường)
        normalized_title = chapter_title.lower()
        if normalized_title in seen_titles:
            continue

        seen_titles.add(normalized_title)
        chapter_html = str(body)
        chapter_list.append((chapter_title, chapter_html))

    # Debug in ra tiêu đề đã được thêm
    print(f"✅ Tổng số chương: {len(chapter_list)}")
    for idx, (chapter_title, _) in enumerate(chapter_list, 1):
        print(f"{idx}: {chapter_title}")

    return title, chapter_list
