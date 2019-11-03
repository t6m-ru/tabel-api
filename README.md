# Табель учета рабочего времени 

API клиент - инструмент для подготовки , расчета и формирования файла табеля Excel по ф.Т13.
<p>
    <a href="">
        <img src="https://img.shields.io/badge/version-1.1.0.2-brightgreen.svg?style=flat-square" alt="Version">
    </a>
</p>

## О проекте

- Эффективное использование времени при заполнении табеля. 
- Визуальное представление результатов расчета. 
- Сохранение результатов работы в локальном хранилище браузера.
- Формирование Excel файла графика работы за месяц.
- Формирование Excel файла табеля за месяц /за первую половину месяца .
- Использование API в Ваших проектах. 
- Возможность получения файла табеля путем выполнения запроса из командной строки.

###  Быстрый старт

- Скопируйте файлы на компьютер и откройте файл index.html в браузере.
- В поле ввода введите данные о работе сотрудника.
- Нажмите клавишу ESC для расчета табеля.
- Сохраните данные работы сотрудников в локальном хранилище.
- Выберите вид документа ,сформируйте  Excel файл табеля и скачайте его.
- Введите конфиденциальные данные списком в сформированный файл.
- Файл табеля полностью готов.


###  API

Файлы API клиента - это пример использования API (JavaScript). 

Дополнительно для удобства пользователя в примере выполнено :

- Сохранение и восстановление данных работы сотрудников за текущий месяц.
- Изменение и сохранение размеров рабочих окон.   
- Загрузка примеров заполнения табеля. 
- Просмотр справочника видов рабочего времени.

Вы можете использовать в Ваших программах обращаясь к API как описано далее :

## Примеры CURL запросов 

Для обращения к API необходимо сделать POST-запрос 
	
	curl "http://t6m.ru/api/v1.1/" -H "Content-Type: application/x-www-form-urlencoded" -X POST 
	
c указанием параметров:

	access_token 	-токен
	mode 		- Режим работы :
				0-Авторизация,
				1-Инициализация,
				2-Заполнение табеля,
				3-Табель за месяц,
				4-Табель за первую 1/2 месяца 
	m 		- рабочий месяц  
	cart		- данные о работе сотрудника	

Ответ вернётся в JSON.


## Примеры CURL запросов

### Авторизация

	curl "http://t6m.ru/api/v1.1/" -H "Content-Type: application/x-www-form-urlencoded" \
	-d "access_token=a50a6fe31dcfc65942211faf7dd66cf27043f877" \
	-d "mode=0" 

#### Ответ 

Параметр | Тип      | Варианты            |Описание 
---------|----------|---------------------|----------
info     | string   | ОК ,v1.1            | доступ к сервису

### Инициализация

	curl "http://t6m.ru/api/v1.1/" -H "Content-Type: application/x-www-form-urlencoded" \
	-d "access_token=a50a6fe31dcfc65942211faf7dd66cf27043f877" \
	-d "mode=1" 
#### Ответ 

Параметр | Тип      |  Описание 
---------|----------|--------------
samples  | array    | примеры заполнения табеля 
docs     | array    | доступные документы 
rv       | array    | виды рабочего времени  


### Работа

	curl "http://t6m.ru/api/v1.1/" -H "Content-Type: application/x-www-form-urlencoded" \
	-d "access_token=a50a6fe31dcfc65942211faf7dd66cf27043f877" \
	-d "mode=2" \
	-d "m=1" \
   	--data-urlencode 'cart={"s":["=/5"]}'

#### Ответ 

Параметр | Тип      |  Описание 
---------|----------|--------------
clnd     | string   | календарь на месяц
calc     | array    | итоги по сотрудникам
table    | array    | данные для заполнения таблицы табеля  


### Табель ф.Т13 за месяц

	curl "http://t6m.ru/api/v1.1/" \
	-H "Content-Type: application/x-www-form-urlencoded" \
	-d "access_token=a50a6fe31dcfc65942211faf7dd66cf27043f877" \
	-d "mode=3" \
	-d "m=10" \
	--data-urlencode 'cart={"s":["=/5"]}'

#### Ответ 

Параметр | Тип      |  Описание 
---------|----------|--------------
url      | string   | Cсылка для скачивания файла


### Табель ф.Т13 за 1/2 месяца

	curl "http://t6m.ru/api/v1.1/" \
	-H "Content-Type: application/x-www-form-urlencoded" \
	-d "access_token=a50a6fe31dcfc65942211faf7dd66cf27043f877" \
	-d "mode=4" \
	-d "m=10" \
	--data-urlencode 'cart={"s":["=/5"]}'

#### Ответ 

Параметр | Тип      |  Описание 
---------|----------|--------------
url      | string   | Cсылка для скачивания файла



##  История изменений

V1.1.0.2	 -03.11.2019  
	Расширение функционала:
	Добавлен отчет Графики работы
	Быстрое заполнение отдельных дней 

V1.1.0.1	 -17.10.2019  
	Изменение функционала клиента :
	Добавлен список подразделений
	Кнопка редактирования списка подразделений.
	(Фамилии и названия подразделений не передаются в запросах серверу и необходимы только для удобства работы пользователя. Хранение этих данных осуществляется в локальном хранилище браузера.)

V1.1	 -  14.10.2019
	Изменение кода клиента и сервера .(Переход с  XMLHttpRequest на fetch API)
	Добавлена возможность ввода фамилий в поле ввода данных. 

V1.0 	-  03.10.2019  
	Начало работы 

##  Контакты , информация  

	Сайт:  http://www.t6m.ru
	Почта: mail@t6m.ru
    
##  Лицензия

MIT
