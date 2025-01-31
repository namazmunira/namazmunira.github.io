import csv
import json
from datetime import datetime

data = {}

with open('data.csv', encoding='utf-8') as f:
    reader = csv.reader(f, delimiter='\t')
    for row in reader:
        if len(row) > 0:  # Проверяем, что строка не пустая
            try:
                # Определяем дату на основе первого столбца
                day = int(row[0])
                current_month = datetime.now().month  # Получаем текущий месяц
                month_number = f"{current_month:02}"  # Форматируем месяц как двухзначное число

                # Форматируем дату с правильным номером месяца
                date = f"{day:02}.{month_number}"

                # Проверяем и форматируем время, если необходимо
                if len(row[1]) == 4:
                    row[1] = f"0{row[1]}"
                if len(row[2]) == 4:
                    row[2] = f"0{row[2]}"

                # Получаем времена из строки
                times = row[1:]
                print(row[1:])
                
                # Сохраняем времена в словарь с форматированной датой в качестве ключа
                data[date] = times
            
            except ValueError:
                print(f"Ошибка при обработке строки: {row}")

# Конвертируем словарь данных в формат JSON
formatted_data = json.dumps(data, ensure_ascii=False)

# Записываем отформатированные данные в файл JSON
with open('file.json', 'w', encoding='utf-8') as f:
    f.write(formatted_data)
