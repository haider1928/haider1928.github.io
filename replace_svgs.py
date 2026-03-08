import os
import glob
import base64

base_dir = r'e:\PROGRAMMING\haider1928.github.io'

def get_img(name):
    return os.path.join(base_dir, name)

images = {
    'og-cover': get_img('og-cover.jpg'),
    'ai-bug-hunter': get_img('ai-bug-hunter.jpg'),
    'ai-bughunter': get_img('ai-bughunter.jpg'),
    'csp-lab': get_img('csp-lab.jpg'),
    'csp-writeups': get_img('csp-lab.jpg'),
    'discord-bot': get_img('discord-bot.jpg'),
    'discord-bots': get_img('discord-bot.jpg'),
    'esp32-control': get_img('esp32.jpg'),
    'esp32': get_img('esp32.jpg'),
    'instagram-bots': get_img('instagram-bots.jpg'),
    'recon-engine': get_img('recon-pipeline.jpg'),
    'recon-pipeline': get_img('recon-pipeline.jpg'),
    'websites': get_img('csp-lab.jpg'),
    'websocket-lab': get_img('websocket-lab.jpg'),
    'websocket-tools': get_img('websocket-lab.jpg'),
    'xss-research': get_img('xss-research.jpg')
}

def get_base64_image(path):
    with open(path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

svg_files = glob.glob('assets/**/*.svg', recursive=True)

for svg_path in svg_files:
    basename = os.path.basename(svg_path).replace('.svg', '')
    img_path = images.get(basename)
    
    if not img_path or not os.path.exists(img_path):
        print(f"Skipping {svg_path}, image {img_path} not found")
        continue
        
    b64 = get_base64_image(img_path)
    ext = os.path.splitext(img_path)[1][1:].lower()
    mime_type = 'image/jpeg' if ext in ['jpg', 'jpeg'] else f'image/{ext}'
    
    new_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <image href="data:{mime_type};base64,{b64}" width="1200" height="675" preserveAspectRatio="xMidYMid meet" />
</svg>'''
    
    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write(new_svg)
    print(f"Updated {svg_path} with {basename}.jpg")
