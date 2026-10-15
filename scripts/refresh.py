#!/usr/bin/env python3
"""Refresh public SVGs atomically. Never replace a good image with an error card."""
import argparse
import datetime
import json
import os
import re
from pathlib import Path
import urllib.request
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BAD_TEXT = ('something went wrong', 'could not resolve', 'rate limit', 'deployment_not_found',
            'application error', 'bad credentials', 'user not found', 'no languages data',
            'no language data', 'unable to fetch', 'maximum retries', 'error fetching')

def validate_svg(data):
    root = ET.fromstring(data)
    if root.tag.split('}')[-1] != 'svg':
        raise ValueError('Response is not SVG')
    visible = ' '.join(root.itertext()).lower()
    if any(error in visible for error in BAD_TEXT):
        raise ValueError('Upstream returned an error/empty-data card')
    if b'<script' in data.lower() or len(data) > 8_000_000:
        raise ValueError('Unexpected SVG content')

def install(source, destination):
    data = Path(source).read_bytes()
    validate_svg(data)
    if Path(destination).name.startswith('capsule-'):
        data = b'\n'.join(line.rstrip() for line in data.splitlines()).strip() + b'\n'
    if Path(destination).name == 'stats.svg':
        # hide_rank hides the visible score, but upstream retains it in the accessible title.
        data = re.sub(rb'(<title\b[^>]*>[^<]*), Rank: [^<]*(</title>)', rb'\1\2', data)
    target = ROOT / destination
    target.parent.mkdir(parents=True, exist_ok=True)
    temp = target.with_suffix('.svg.tmp')
    temp.write_bytes(data)
    os.replace(temp, target)

def refresh(selected=None):
    manifest = json.loads((ROOT / 'sources.json').read_text())
    report_path = ROOT / 'evidence/service-status.json'
    previous = json.loads(report_path.read_text()) if report_path.exists() else {}
    for name, item in manifest.items():
        if selected and name not in selected:
            continue
        stamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
        try:
            request = urllib.request.Request(item['url'], headers={'User-Agent': 'Shuwei-Goat-Profile/1.0'})
            with urllib.request.urlopen(request, timeout=25) as response:
                data = response.read(8_000_001)
                status = response.status
            validate_svg(data)
            temp = ROOT / (item['path'] + '.download')
            temp.parent.mkdir(parents=True, exist_ok=True)
            temp.write_bytes(data)
            try:
                install(temp, item['path'])
            finally:
                temp.unlink(missing_ok=True)
            previous[name] = {'state': 'ok', 'checked_at': stamp, 'http_status': status, 'url': item['url']}
            print(name, 'ok')
        except Exception as error:
            previous[name] = {'state': 'unavailable', 'checked_at': stamp, 'error': str(error), 'url': item['url'], 'last_success_at': previous.get(name, {}).get('checked_at') if previous.get(name, {}).get('state') == 'ok' else previous.get(name, {}).get('last_success_at')}
            print(name, 'unavailable:', error)
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(previous, ensure_ascii=False, indent=2) + '\n')

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--only', nargs='+')
    parser.add_argument('--install', nargs=2, metavar=('SOURCE', 'DESTINATION'))
    args = parser.parse_args()
    if args.install:
        install(*args.install)
    else:
        refresh(args.only)
