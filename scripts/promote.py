import datetime,json,os
from pathlib import Path
from refresh import ROOT,install
report={}
for name in ('stats','languages','snake'):
 state=os.environ.get(name.upper(),'not-run')
 try:
  if state!='success':raise ValueError('Generator outcome: '+state)
  install(ROOT/'.generated'/f'{name}.svg',f'profile/{name}.svg')
  report[name]={'state':'ok'}
 except Exception as e:
  report[name]={'state':'unavailable','error':str(e)}
  print(name,'kept previous image:',e)
 report[name]['checked_at']=datetime.datetime.now(datetime.timezone.utc).isoformat()
(ROOT/'evidence/action-status.json').write_text(json.dumps(report,indent=2)+'\n')
