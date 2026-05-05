import os
import subprocess
import sys

# 从命令行接收输入和输出文件夹路径，运行方式：python translator.py 输入路径 输出路径
input_dir = sys.argv[1]
output_dir = sys.argv[2]

# 递归遍历输入文件夹及其所有子文件夹，每次循环返回：当前文件夹路径、子文件夹列表、文件列表
for folder, subfolders, files in os.walk(input_dir):
    # 遍历当前文件夹里的每一个文件
    for file in files:
        # 只处理 mp3 文件，跳过其他类型
        if file.endswith(".mp3"):
            # 拼出完整的输入文件路径
            input_path = os.path.join(folder, file)
            # 把输入根路径替换成输出根路径，保留 CN/ENG/JPN 子层级结构
            output_folder = folder.replace(input_dir, output_dir)
            # 确保输出文件夹存在，不存在则自动创建，已存在不报错
            os.makedirs(output_folder, exist_ok=True)
            # 把文件名的 .mp3 替换成 .ogg
            ogg_name = file.replace(".mp3", ".ogg")
            # 拼出完整的输出文件路径
            output_path = os.path.join(output_folder, ogg_name)
            # 调用 ffmpeg 执行格式转码，读取 mp3 数据，用 ogg 编码重新写出新文件
            subprocess.run(["ffmpeg", "-i", input_path, output_path])