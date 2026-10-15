import json,sys,os
from refresh import ROOT
failures=[]
for name in ['action-status','service-status']:
 p=ROOT/'evidence'/f'{name}.json'
 if p.exists():
  for component,status in json.loads(p.read_text()).items():
   if name=='service-status' and component not in ('typing-game',):continue
   if status['state']!='ok':failures.append(component+': '+status.get('error','unavailable'))
text='## Profile refresh\n'+('\n'.join('- '+x for x in failures) if failures else 'All requested cards updated successfully.')+'\n'
if os.environ.get('GITHUB_STEP_SUMMARY'):
 with open(os.environ['GITHUB_STEP_SUMMARY'],'a') as f:f.write(text)
print(text)
sys.exit(bool(failures))
