#!/usr/bin/env python3
"""Update portfolio sections in both variants from explicit user-owned data."""
import html,json,re
from pathlib import Path
from urllib.parse import urlsplit
R=Path(__file__).resolve().parents[1]
def safe_url(value):
 p=urlsplit(value)
 if p.scheme not in ('http','https') or not p.netloc or p.username or p.password:
  raise ValueError('Use a complete http(s) URL without credentials')
 return html.escape(value,quote=True)
def project_card(p):
 for key in ('name','description','experience_url','video_url'):
  if not isinstance(p.get(key),str) or not p[key].strip():raise ValueError('Missing project field: '+key)
 body='<h3>'+html.escape(p['name'])+'</h3>\n\n'
 if p.get('cover_url'):body+='<img src="'+safe_url(p['cover_url'])+'" alt="'+html.escape(p['name'],quote=True)+' 封面" width="720" />\n\n'
 body+='<p>'+html.escape(p['description'])+'</p>\n\n'
 labels={'experience_url':'在线体验 ↗','video_url':'视频介绍 ↗','product_url':'产品介绍 ↗','repository_url':'源码仓库 ↗'}
 body+='<p>'+' · '.join('<a href="'+safe_url(p[k])+'">'+label+'</a>' for k,label in labels.items() if p.get(k))+'</p>'
 return body

def render():
 projects=json.loads((R/'projects.json').read_text());skills=json.loads((R/'skills.json').read_text())
 if not isinstance(projects,list) or not isinstance(skills,list):raise ValueError('Content files must contain arrays')
 project_html='\n\n'.join(map(project_card,projects))
 skill_html=[]
 for skill in skills:
  if not all(isinstance(skill.get(k),str) and skill[k].strip() for k in ('name','description','repository_url')):raise ValueError('Skill needs name, description and repository_url')
  skill_html.append('<h3><a href="'+safe_url(skill['repository_url'])+'">'+html.escape(skill['name'])+'</a></h3>\n\n<p>'+html.escape(skill['description'])+'</p>')
 outputs={}
 for variant in ('game',):
  p=R/f'README.{variant}.md';s=p.read_text()
  for section,body in [('PROJECTS',project_html or '筹备中'),('SKILLS','\n\n'.join(skill_html) or '筹备中')]:
   s=re.sub(f'<!-- {section}:START -->.*?<!-- {section}:END -->',lambda m:f'<!-- {section}:START -->\n{body}\n<!-- {section}:END -->',s,flags=re.S)
  outputs[p]=s
 for p,s in outputs.items():p.write_text(s)
if __name__=='__main__':render()
