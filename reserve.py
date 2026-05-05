#导入json和openpyxl库
import json
import openpyxl
#读取CARD_ZH.json文件，要考虑不同语言的文件格式，用只读的方式打开
CARD_ZH = open("D:/VsProject/CARD_ZH.json","r",encoding="utf-8")
CARD_JPN = open("D:/VsProject/CARD_JPN.json","r",encoding="utf-8")
CARD_ENG = open("D:/VsProject/CARD_ENG.json","r",encoding="utf-8")
#将json文件转换为字典
CARD_ZH_LIST = json.load(CARD_ZH)
CARD_JPN_LIST = json.load(CARD_JPN)
CARD_ENG_LIST = json.load(CARD_ENG)
#创建一个excel文件
CARD_ZH_EXCEL=openpyxl.Workbook()

#获取excel文件的第一个sheet
Excel_sheet_ZH=CARD_ZH_EXCEL.active


#遍历CARD_ZH_LIST中的所有key  如果key以.title结尾，则打印key的值
Excel_sheet_ZH.append(["卡牌ID","卡牌中文名称","卡牌日文名称","卡牌英文名称","描述"])
for key in CARD_ZH_LIST.keys():
    if key.endswith(".title"):
        print(CARD_ZH_LIST[key])
        #将key的值添加到excel文件的第一个sheet中
        Excel_sheet_ZH.append([key.replace(".title",""),CARD_ZH_LIST[key],CARD_JPN_LIST[key],CARD_ENG_LIST[key],CARD_ZH_LIST.get(key.replace(".title","")+".description",'')])
#保存excel文件
CARD_ZH_EXCEL.save("D:/VsProject/CARD_ZH.xlsx")
    