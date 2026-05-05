import os
import json
import openpyxl
import edge_tts
import asyncio
os.makedirs("D:/VsProject/audio/edge-tts/ENG/", exist_ok=True)
os.makedirs("D:/VsProject/audio/edge-tts/CN/", exist_ok=True)
os.makedirs("D:/VsProject/audio/edge-tts/JPN/", exist_ok=True)
Excel_sheet=openpyxl.load_workbook("D:/VsProject/CARD_ZH.xlsx").active
async def generate(text, voice, output_path):
    tts = edge_tts.Communicate(text=text, voice=voice)
    await tts.save(output_path)
for row in Excel_sheet.iter_rows(min_row=2,  values_only=True):
    CARD_ID=row[0]
    CN_NAME=row[1]
    ENG_NAME=row[3]
    JPN_NAME=row[2]
    asyncio.run(generate(CN_NAME, "zh-CN-XiaoxiaoNeural", f"D:/VsProject/audio/edge-tts/CN/{CARD_ID+'_CN'}.mp3"))
    asyncio.run(generate(ENG_NAME, "en-US-AvaMultilingualNeural", f"D:/VsProject/audio/edge-tts/ENG/{CARD_ID+'_ENG'}.mp3"))
    asyncio.run(generate(JPN_NAME, "ja-JP-NanamiNeural", f"D:/VsProject/audio/edge-tts/JPN/{CARD_ID+'_JPN'}.mp3"))