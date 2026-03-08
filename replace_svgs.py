import os
import glob
import base64

base_dir = r'e:\PROGRAMMING\haider1928.github.io'
images = {
    'ai_bughunter': os.path.join(base_dir, 'ai_bughunter.jpg'),
    'esp32': r'C:\Users\Haider\.gemini\antigravity\brain\ee1341bf-cc61-4d85-a4f9-8f9c56f2a5cc\esp32_control_1772960478411.png',
    'discord': os.path.join(base_dir, 'discord_bot.jpg'),
    'instagram': os.path.join(base_dir, 'instagram_bot.jpg'),
    'recon': os.path.join(base_dir, 'recon.jpg'),
    'csp': os.path.join(base_dir, 'csp.jpg')
}

image_map = {
    'og-cover': 'ai_bughunter',
    'ai-bug-hunter': 'ai_bughunter',
    'ai-bughunter': 'ai_bughunter',
    'csp-lab': 'csp',
    'csp-writeups': 'csp',
    'discord-bot': 'discord',
    'discord-bots': 'discord',
    'esp32-control': 'esp32',
    'esp32': 'esp32',
    'instagram-bots': 'instagram',
    'recon-engine': 'recon',
    'recon-pipeline': 'recon',
    'websites': 'csp',
    'websocket-lab': 'recon',
    'websocket-tools': 'recon',
    'xss-research': 'ai_bughunter'
}

def get_base64_image(path):
    with open(path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

svg_files = glob.glob('assets/**/*.svg', recursive=True)

for svg_path in svg_files:
    basename = os.path.basename(svg_path).replace('.svg', '')
    img_key = image_map.get(basename, 'ai_bughunter')
    img_path = images.get(img_key)
    
    if not img_path or not os.path.exists(img_path):
        print(f"Skipping {svg_path}, image {img_path} not found")
        continue
        
    b64 = get_base64_image(img_path)
    ext = os.path.splitext(img_path)[1][1:].lower()
    mime_type = 'image/jpeg' if ext in ['jpg', 'jpeg'] else f'image/{ext}'
    
    new_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <image href="data:{mime_type};base64,{b64}" width="1200" height="675" preserveAspectRatio="xMidYMid slice" />
</svg>'''
    
    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write(new_svg)
    print(f"Updated {svg_path} with {img_key}")
