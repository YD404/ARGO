import urllib.request
import json
import os

# スクリプトのあるディレクトリを基準にする
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
API_KEY_FILE = os.path.join(BASE_DIR, ".api_key")
DATA_DIR = os.path.join(BASE_DIR, "data")
OUTPUT_FILE = os.path.join(DATA_DIR, "members.json")

# APIキーを読み込み
if os.path.exists(API_KEY_FILE):
    with open(API_KEY_FILE, "r") as f:
        API_KEY = f.read().strip()
else:
    print(f"❌ APIキーファイルが見つかりません: {API_KEY_FILE}")
    print("   .api_key ファイルにAPIキーを保存してください")
    exit(1)

URL = "https://argo.microcms.io/api/v1/members?limit=100"
req = urllib.request.Request(URL, headers={"X-MICROCMS-API-KEY": API_KEY})

try:
    # dataディレクトリがなければ作成
    os.makedirs(DATA_DIR, exist_ok=True)
    
    with urllib.request.urlopen(req) as res:
        data = json.loads(res.read())
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✅ 取得成功！ {data['totalCount']}件のメンバーを保存しました")
        print(f"   → {OUTPUT_FILE}")
except urllib.error.HTTPError as e:
    print(f"❌ HTTPエラー: {e.code} - {e.reason}")
except Exception as e:
    print(f"❌ エラー: {e}")
