import importlib.util,json,tempfile,unittest,xml.etree.ElementTree as ET,re
from pathlib import Path
from refresh import ROOT,validate_svg,install
from update_content import project_card,safe_url
class ProfileChecks(unittest.TestCase):
 def test_all_local_images_exist(self):
  for v in ['game']:
   s=(ROOT/f'README.{v}.md').read_text()
   for p in re.findall(r'(?:src|srcset)="([^"]+)"',s):
    if not p.startswith('https://'):self.assertTrue((ROOT/p).is_file(),p)
 def test_public_identity_only(self):
  for v in ['game']:
   s=(ROOT/f'README.{v}.md').read_text()
   for forbidden in ['羊淑葳','北京大学','南开大学','百度','WanderMark','mailto:']:
    self.assertNotIn(forbidden,s)
   self.assertNotRegex(s,r'(?<!\d)1[3-9]\d{9}(?!\d)')
   self.assertNotIn('<details',s)
 def test_selected_profile_has_no_removed_modules_or_microcopy(self):
  readme=(ROOT/'README.game.md').read_text()
  hero_path=ROOT/'assets/hero-game.svg'
  hero=hero_path.read_text() if hero_path.exists() else ''
  workflow=(ROOT/'.github/workflows/profile-assets.yml').read_text()
  for word in ['<sub','<small','streak','trophy','metrics','EXPLORATION LOG','THE SNAKE TRAIL','profile/stats.svg','profile/languages.svg','komarev.com']:
   self.assertNotIn(word,readme)
  for word in ['STILL EXPLORING','NO LEVELS','把好奇心','角色已就位','PLAYER PROFILE']:
   self.assertNotIn(word,hero)
  for word in ['streak','trophy','metrics','METRICS_TOKEN','card: stats','card: top-langs','Platane/snk','promote.py']:
   self.assertNotIn(word,workflow)
 def test_invalid_svg_does_not_replace_previous(self):
  with tempfile.TemporaryDirectory() as tmp:
   src=Path(tmp)/'new.svg';dst=Path(tmp)/'good.svg';dst.write_text('<svg xmlns="http://www.w3.org/2000/svg"><text>good</text></svg>');original=dst.read_bytes()
   for value in ['<html>error</html>','<svg><text>Something went wrong</text></svg>','<svg><script>alert(1)</script></svg>']:
    src.write_text(value)
    with self.assertRaises((ValueError,ET.ParseError)):install(src,str(dst))
    self.assertEqual(dst.read_bytes(),original)
 def test_optional_links_omitted_and_text_escaped(self):
  p={'name':'<script>','description':'A & B','experience_url':'https://example.com/app','video_url':'https://example.com/video'}
  s=project_card(p);self.assertIn('&lt;script&gt;',s);self.assertNotIn('产品介绍',s);self.assertNotIn('源码仓库',s)
 def test_required_project_fields(self):
  with self.assertRaises(ValueError):project_card({'name':'x'})
 def test_unsafe_url(self):
  for url in ['javascript:alert(1)','https://user:password@example.com','/relative','#']:
   with self.assertRaises(ValueError):safe_url(url)
 def test_manifest_account(self):
  manifest=json.loads((ROOT/'sources.json').read_text())
  for n in ['typing-game']:self.assertIn('Shuwei-Goat',manifest[n]['url'])
if __name__=='__main__':unittest.main()
