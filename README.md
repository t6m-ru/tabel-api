# Табель учета рабочего времени 

	API клиент - простой в использовании инструмент для подготовки , расчета и формирования файла табеля xls.
	
## О проекте

	Эффективно используем свое время для заполнения табеля. 
	Визуальное представление результатов расчета. 
	Сохранение результатов работы в локальном хранилище браузера.
	Формирование Excel файла табеля за месяц /за первую половину месяца .
	Использование API в Ваших проектах. 

###  Быстрый старт

	Скопируйте файлы на компьютер и откройте файл index.html в браузере.
    	В поле ввода введите данные о работе сотрудника.
    	Нажмите клавишу ESC для расчета табеля.
	Сформируйте  Excel файл табеля и скачайте его.
    	Введите конфиденциальные данные списком в сформированный файл .

###  API

Файлы API клиента - это пример использования API (JavaScript). 

Примеры на curl

Передаваемые параметры :
	
	access_token=a50a6fe31dcfc65942211faf7dd66cf27043f877 - токен
	ver=1.0 - версия API
	mode - Режим работы :  0-Авторизация, 1-Инициализация, 2-Заполнение табеля, 3-Файл табеля за месяц, 4-Файл табеля  за первую 1/2 месяца 
	m - месяц  

// Авторизация
curl "http://t6m.ru/api/" \
	-H "Content-Type: application/x-www-form-urlencoded" \
	-X POST \
	-d "access_token=a50a6fe31dcfc65942211faf7dd66cf27043f877" \
	-d "ver=1.0"\
	-d "mode=0" 

Ответ сервера JSON файл :
     info - информация о доступе к сервису 

// Инициализация
curl "http://t6m.ru/api/" \
	-H "Content-Type: application/x-www-form-urlencoded" \
	-X POST \
	-d "access_token=a50a6fe31dcfc65942211faf7dd66cf27043f877" \
	-d "ver=1.0"\
	-d "mode=1" 

Ответ сервера JSON файл :
	samples- массив примеров заполнения табеля
	docs - список доступных документов 
	rv- массив видов рабочего времени 


// Работа
curl "http://t6m.ru/api/" \
	-H "Content-Type: application/x-www-form-urlencoded" \
	-X POST \
	-d "access_token=a50a6fe31dcfc65942211faf7dd66cf27043f877" \
	-d "ver=1.0"\
	-d "mode=2" \
	-d "m=1" \
    --data-urlencode 'cart={"s":["1=/5"]}'

Ответ сервера JSON файл :
	clnd- календарь на месяц
	calc- итоги по сотрудникам
	table- данные для заполнения таблицы табеля  


// Табель ф.Т13 за месяц
curl "http://t6m.ru/api/" \
	-H "Content-Type: application/x-www-form-urlencoded" \
	-X POST \
	-d "access_token=a50a6fe31dcfc65942211faf7dd66cf27043f877" \
	-d "ver=1.0"\
	-d "mode=3" \
	-d "m=10" \
    --data-urlencode 'cart={"s":["1=/5"]}'


Ответ сервера - ссылка для скачивания файла : http://t6m.ru/api/Files/89f....37_Tabel_2019_10.xls

// Табель ф.Т13 за 1/2 месяца
curl "http://t6m.ru/api/" \
	-H "Content-Type: application/x-www-form-urlencoded" \
	-X POST \
	-d "access_token=a50a6fe31dcfc65942211faf7dd66cf27043f877" \
	-d "ver=1.0"\
	-d "mode=4" \
	-d "m=10" \
    --data-urlencode 'cart={"s":["1=/5"]}'

Ответ сервера - ссылка для скачивания файла  : http://t6m.ru/api/Files/89f.....47_Tabel_2019_10_1_2_.xls


##  Контакты , информация  

	Сайт:  http://www.t6m.ru
	Почта: mail@t6m.ru
    
##  Лицензия

	MIT
