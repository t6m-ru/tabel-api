    var token = 'a50a6fe31dcfc65942211faf7dd66cf27043f877'; //Тестовый токен

    var api_server = 'http://t6m.ru/api/v1.1/';   // сервер API
	var msg_start = 'Введите данные о работе сотрудников (см. Примеры заполнения)'; // строка инфо начало 
	var msg_default = 'Введите данные о работе сотрудников '; // строка инфо по умолчанию 
	var txt_default = "Иванов= /5 + 1 10 ОТ\nПетров= 4.2 + 11 12 13=10\nСидоров= 10 + 10 20 ОТ + 21 24 ОД\nНиколаев= 5 * + 14 18 К +20 26 У" ; // заполнение режима работы по умолчанию 
	var txt_clear  = "Иванов=\n=\n=\n=\n=\n=" ; // заполнение режима работы по умолчанию 
	
	var d_w = 0;  // дельта  ширина блока wrap
	var d_h = 0;  // дельта  высота блока sotr
	var d_eh = 0; // дельта  высота блока edit
    
    var sample_array =[]; //массив примеров

	var edit_mode =0; // 1 - режим редактирования подразделений 

	document.addEventListener('DOMContentLoaded', function(){
		if (!navigator.onLine) {alert('Отсутствует интернет подключение');return;}
		init_();
		document.getElementById('m').selectedIndex =  (new Date()).getMonth(); // Рабочий месяц
		document.getElementById('textarea').value = txt_default; // Текст по умолчанию
		Send_Json(0); // Авторизация
		Send_Json(1); // Инициализация
		Send_Json(2); // Работа	
	})

	document.onmouseup = clearXY;
	document.onclick = function(event) {
	    var target = event.target;
	    if (target.id !='btn_rv') { // скрываем список Виды РВ
			var dropdowns = document.getElementsByClassName("dropdown-content");
			for (var i = 0; i < dropdowns.length; i++) {
				var openDropdown = dropdowns[i];
				if (openDropdown.classList.contains('rv_show')) {
					openDropdown.classList.remove('rv_show');
				}
			}
	    }
	    if (target.id !='btn_ex' ) { // скрываем список Примеры заполнения
			var dropdowns = document.getElementsByClassName("dropdown-content");
			for (var i = 0; i < dropdowns.length; i++) {
				var openDropdown = dropdowns[i];
				if (openDropdown.classList.contains('ex_show')) {
					openDropdown.classList.remove('ex_show');
				}
			}
	    }
	}

// Инициализация
	function init_(){
		// сохраняем token в локальное хранилище браузера
		localStorage.setItem('_access_token' , token);
        // восстанавливаем размеры блоков или сохраняем текущие размеры 
		var S_W = localStorage.getItem('SW');
		if (S_W == null) {S_W =  document.getElementById("wrap").offsetHeight;localStorage.setItem('SW', S_W);} else {document.getElementById("wrap").style.width = S_W + "px";}
		var S_H = localStorage.getItem('SH');
		if (S_H == null) {S_H =  document.getElementById("sotr").offsetHeight; localStorage.setItem('SH', S_H);} else {document.getElementById("sotr").style.height = S_H + "px";}
		var E_H = localStorage.getItem('EH');
		if (E_H == null) {E_H =  document.getElementById("edit").offsetHeight;localStorage.setItem('EH', E_H);} else {document.getElementById("edit").style.height = E_H + "px"; E_H =E_H - 50; document.getElementById("textarea").style.height = E_H + "px"; }

        // восстанавливаем список подразделений из локального хранилища
   		var getItem = localStorage.getItem('2020_unit');
   		if (getItem != null) {
				var sel = document.getElementById('u');
				while (sel.options.length) {
					sel.options[0] = null;
				}
				var ar =getItem.split(',');
				for (var i = 0; i < ar.length; ++i) {
				    sel.add(new Option(ar[i],i+1)) ;
			    }
		}

		document.getElementById("sotr_resize").onmousedown = saveWH;
		document.getElementById("edit_resize").onmousedown = saveWH;
        document.getElementById('textarea').value = "";
		document.getElementById("textarea").focus();
	}


// Обработчики кнопок 

	function Btn_u() {
		var str ='';
		var sel = document.getElementById( 'u'); 
		document.getElementById('sotr').innerHTML = '';
		for (var i = 0; i < sel.length; ++i) str = str + sel.options[i].text+'\n';

	    document.getElementById('textarea').value= str;
		document.getElementById("textarea").focus();
		document.getElementById("lb").innerHTML = 'Отредактируйте список подразделений и нажмите клавишу ESC для сохранения';
		edit_mode = 1;
	}


	function Btn_run() {
		document.getElementById("button").disabled = true;
		Send_Json(document.getElementById('doc').value);
		document.getElementById("textarea").focus();
	}

	function Btn_save() {
		localStorage.setItem('2020_' + document.getElementById("m").value+'_'+document.getElementById("u").value, document.getElementById('textarea').value);
		document.getElementById("btn_load").style.display = 'block';
		document.getElementById("textarea").focus();
	}

	function Btn_load() {
		var data_a= localStorage.getItem('2020_' + document.getElementById("m").value+'_'+document.getElementById("u").value);
		if (data_a!= null) {
			document.getElementById('textarea').value= data_a;
			Send_Json(2);
		}
	}
	function Btn_clear() {
			document.getElementById('textarea').value= txt_clear;
			Send_Json(2);
	}

// Обработчики списков 
	function Btn_rv() {
	  document.getElementById("rvDropdown").classList.toggle("rv_show");
	}

	function Btn_ex() {
	  document.getElementById("exDropdown").classList.toggle("ex_show");
	}

// Выбор месяца
    function OnSel_month (select) {
		document.getElementById('sotr').innerHTML = '';
		document.getElementById("btn_load").style.display = 'none';
		var data_a=localStorage.getItem('2020_' + document.getElementById("m").value+'_'+document.getElementById("u").value);
		if (data_a != null){
			document.getElementById("btn_load").style.display = 'block';
		    document.getElementById('textarea').value= data_a;
		}else{
			document.getElementById('textarea').value = txt_clear;
		}
		Send_Json(2);
		document.getElementById("lb").innerHTML = msg_start;
    }

// Выбор подразделения
    function OnSel_u (select) {
		OnSel_month();
		document.getElementById('textarea').focus();
    }

// Выбор документа
    function OnSel_doc (select) {
		document.getElementById('textarea').focus();
    }


// Выбор Вида РВ
    function OnSel_rv(select) {
		var ar = rv_array[select].split('~');
		if (ar[0]!='0'){
			document.getElementById("lb").innerHTML = 'Вид РВ: '+ar[1];
			document.getElementById("rvDropdown").classList.toggle("show");
			document.getElementById("textarea").focus();
		}
    }

// Выбор примера заполнения
    function OnSel_ex (select) {
		var ar =sample_array [select].split('~');
		if (ar[0]!='0'){
			document.getElementById('textarea').value ='';
			document.getElementById('sotr').innerHTML = '';			
			for (var i = 2; i < ar.length; ++i) {
				document.getElementById('textarea').value += ar[i]+'\n';
			}
			Send_Json(2);
			document.getElementById("exDropdown").classList.toggle("show");
			document.getElementById("lb").innerHTML = 'Пример заполнения: '+ar[1];
		}
    }

// Обработка нажатия клавиш
    function KJ(e){
		if (e.which == 27){ // ESC
			if (edit_mode == 1){ // режим редактирования 
				var ww = document.getElementById('textarea').value.replace(/\n+/g,'\n').split('\n').filter(element => element !== ''); //textarea в массив				
				localStorage.setItem('2020_unit', ww);
				var sel = document.getElementById('u');
				while (sel.options.length) {
					sel.options[0] = null;
				}
				for (var i = 0; i < ww.length; ++i) {
				    sel.add(new Option(ww[i],i+1)) ;
			    }
				edit_mode =0;
				OnSel_month();
			}else{
				Send_Json(2);
			}
		}
	}

//  Изменение размеров блоков sotr и edit
	function getXY(e) {
		if (e) {x = e.pageX;y = e.pageY;} else {x = window.event.clientX;y = window.event.clientY;}
		return new Array(x, y);
	}

	function saveWH(e) {

		var point = getXY(e);
		id_event = e.target.id; 
		d_w = document.getElementById("sotr").clientWidth - point[0]; 
		d_h = document.getElementById("sotr").clientHeight - point[1]; 
		d_eh = document.getElementById("edit").clientHeight - point[1];
		document.onmousemove = resizeBlock;
		document.addEventListener("onmousemove", resizeBlock, false);
		return false;
  }

	function clientWidth() {return document.documentElement.clientWidth == 0 ? document.body.clientWidth : document.documentElement.clientWidth;}

	function clientHeight() {return document.documentElement.clientHeight == 0 ? document.body.clientHeight : document.documentElement.clientHeight;}

	function clearXY() {document.onmousemove = null;}

// Изменение ширины и высоты блоков и сохранение значений в хранилище
	function resizeBlock(e) {
		var point = getXY(e);
		new_w = d_w + point[0]; 
		new_h = d_h + point[1]; 
		new_eh = d_eh + point[1]; 
		if (id_event =='sotr_resize'){
			document.getElementById("sotr").style.height = new_h + "px"; 
			document.getElementById("clnd").style.overflowY = (document.getElementById("sotr").scrollHeight !=document.getElementById("sotr").offsetHeight)? 'scroll' :'hidden';
			localStorage.setItem('SH', new_h);
		} else{
			document.getElementById("edit").style.height = new_eh + "px"; 
			localStorage.setItem('EH', new_eh);
			new_eh =new_eh - 50;
			document.getElementById("textarea").style.height = new_eh + "px"; 
		}
		document.getElementById("wrap").style.width = new_w + "px"; 
		localStorage.setItem('SW', new_w);
 }

// 	Запрос к серверу и обработка ответа 

	function Send_Json(ee){

		edit_mode =0;
		document.getElementById("svg").style.display = 'block';
		document.getElementById("lb").innerHTML = msg_default;
		access_token = localStorage.getItem('_access_token');
		const regX = /[^А-Яа-я]/gm; // все кроме русских букв

		var month_v =document.getElementById("m").value;
		var ss = [];
		var fio = [];
		var ww = document.getElementById('textarea').value.replace(/\n+/g,'\n').split('\n').filter(element => element !== ''); //textarea в массив
		for (var i=0, len=ww.length; i<len; i++) {
   			if (ww[i][0] !='+'){
				var sk = ww[i].split('=');
    				fio.push(sk[0].replace(regX,'')); // собираем fio в массив
					ss.push("="+ww[i].slice(ww[i].indexOf("=")+1)); // удаляем фамилии из данных при запросе
				}else{
					ss.push(ww[i]); // строку справочника не изменяем
				}
			}

		const requestData = {};
				requestData.access_token = access_token;
				requestData.mode = ee;
				if (ee >1) {
					requestData.m = month_v;
					requestData.cart = JSON.stringify({s:ss});
				}
			const usersPromise = fetch(api_server, {
			method : 'POST',
			headers: {
            'Content-Type': 'application/json;charset=utf-8'    
			},
			cache: 'no-cache',
			body : JSON.stringify(requestData)
				}).then(response => {
									if (!response.ok) {
											document.getElementById("svg").style.display = 'none';
											document.getElementById("button").disabled = false;
											document.getElementById("textarea").focus();
											alert( 'Ошибка запроса : ' + xhr.status);
											return;	
									}
								  return response.json();
					}).then(responseData => {

						if (ee == 0) { // Авторизация
								if (responseData.info.substring(0,1) !='*') {
									document.getElementById("check_info").innerHTML = responseData.info;
									document.getElementById("lb").innerHTML = msg_start;
								} else {
									document.getElementById("check_info").innerHTML = 'v.1.1'; 
								}
						}
						if (ee == 1) { // Инициализация
									sample_array =responseData.samples;  // Загрузка примеров
									var div = document.getElementById('exDropdown');
									for (var i = 0; i < sample_array.length; ++i) {
										var e    = document.createElement('a');
										ar =sample_array [i].split('~');
										e.setAttribute('onclick', "OnSel_ex("+i+");return false;") ;
										e.setAttribute('class', 'st'+ar[0]) ;
										e.appendChild(document.createTextNode(ar[1]));
										div.appendChild(e);
									}
									doc_array =responseData.docs; // Загрузка списка документов
								    var select2 = document.getElementById( 'doc');
									for (var i = 0; i < doc_array.length; ++i) {
									    ar =doc_array [i].split('~');
								        select2.add(new Option(ar[1],ar[0])) ;
								    }
		
								    rv_array=responseData.rv; // Загрузка видов РВ
								    var div = document.getElementById('rvDropdown');
									for (var i = 0; i < rv_array.length; ++i) {
										var e    = document.createElement('a');
										ar =rv_array[i].split('~');
										e.setAttribute('onclick', "OnSel_rv("+i+");return false;") ;
										e.appendChild(document.createTextNode(ar[1]));
										e.setAttribute('class', 'st'+ar[0]) ;
										div.appendChild(e);
									}
						}
						if (ee >1)
						{ // Информация о текущем состоянии или ошибке
								if (responseData.info != undefined) {
									if (responseData.info.substring(0,1) =='*') {
										document.getElementById("lb").innerHTML = responseData.info.substring(1,100);
										document.getElementById("sotr").innerHTML = '';
										document.getElementById("svg").style.display = 'none';
										document.getElementById("button").disabled = true;
										document.getElementById("textarea").focus();
										return;
									} else {
										 document.getElementById("lb").innerHTML = responseData.info;
									}
								}
								}		
						if (ee == 2){  // Заполнение таблицы сотрудников 
		
							function nCell(e0,e1,e2,e3){ // установка класса ячейки таблицы
								var newCell = newRow.insertCell(e0);
								newCell.innerHTML= e2 ;
								if (e1=="a0"){
									cc='c'+e3;
									newCell.className = cc ;
								} else if (e1=="a01") {
									cc='c0'+e3;
									newCell.className = cc ;
								} else {
									newCell.className=e1;
								}
							}
							var mount= document.getElementById("m").value;
							var date = new Date(2020, (mount-1), 1);
							var days = ['ВС', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'СБ']; //дни недели
							var day = date.getDay(date); // День недели 1 числа текущего месяца
		                    var dm = responseData.clnd.length; // кол-во дней в мес
		                    var color_=responseData.clnd ;     //  дни месяца цвет
							var dn_data  = []; // массив данных работы сотрудника по дням месяца
							var r_data  = [];  // массив результатов расчета сотрудника за месяц
		
							for (var i = 0; i < responseData.table.length; i++) { 
								sk = responseData.table[i].split(',');
								sk_=sk[1];
								if (sk[2] != '') sk_=sk_+"<br />"+sk[2];
								if (sk[3] != '') sk_=sk_+"<br />"+sk[3];
								dn_data[sk[0]] = sk_; //
							}
		
							for ( var i = 0; i < responseData.calc.length; i++ )	r_data[i] = responseData.calc[i].split(','); 
		
							var newElemC=document.createElement("table"); // Календарь
								newElemC.style.border = "1px solid #a1abab";
								newElemC.style.fontSize = "10px";
								newElemC.style.textAlign = "center";
								newElemC.width = "100%";
								newElemC.style.tableLayout = "fixed";
		
							var newElem=document.createElement("table"); // Сотрудники
								newElem.style.border = "1px solid #a1abab";
								newElem.style.fontSize = "10px";
								newElem.style.textAlign = "center";
								newElem.width = "100%";
								newElem.style.tableLayout = "fixed";
		
		   				    var pCell = 0;
							for( var j = 0; j < (responseData.calc.length+2); j++ ){
							    var newRow= (j<2)? newElemC.insertRow(j) :newElem.insertRow(j-2);
							    var tCell = 0; 
							    if (j==0) nCell(0,"a11","","");
							    if (j==1) nCell(0,"a11","Дни <br />месяца","");
							    if (j>1) {
								    if (fio[j-2]=="") {
										 nCell(0,"a1",("Сотр_"+(j-1)),"");  // Сотр_
									}else{
										 nCell(0,"a1",fio[j-2],""); // фамилия сотрудника
									}	 
								}
								for( var i = 1; i <= responseData.clnd.length; i++ ){
			                        if (j==0) nCell(i,"a01",days[day],color_[tCell],"");
			                        if (j==1) nCell(i,"a01",i,color_[tCell],"");
			                        if (j>1) {
										nCell(i,"a0",(typeof dn_data[pCell] === 'undefined') ? "":dn_data[pCell],color_[tCell],"");
										pCell++;
									}
									tCell++;
									if (tCell == dm) tCell=0;
									day++; if (day > 6) day=0;
								}
		
							    if (j==0) {
									nCell(dm+1,"a3","","");
									nCell(dm+2,"a3","","");
									nCell(dm+3,"a3","","");
									nCell(dm+4,"a3","","");
									nCell(dm+5,"a4","Нея","");
								 }
								if (j==1) {
									nCell(dm+1,"a3","Дн <br />Час","");
									nCell(dm+2,"a3","Ноч","");
									nCell(dm+3,"a3","Пр","");
									nCell(dm+4,"a3","СвУр","");
									nCell(dm+5,"a3","Дни","");
								 }
								if (j>1) {
			 						nCell(dm+1,"a2",(r_data[j-2][0] +"<br />"+ r_data[j-2][1]),"");
									nCell(dm+2,"a2",r_data[j-2][2],"");
									nCell(dm+3,"a2",r_data[j-2][3],"");
									nCell(dm+4,"a2",r_data[j-2][4],"");
									nCell(dm+5,"a4",r_data[j-2][5],"");
								}
							}
						    var elem1 = document.getElementById('clnd');
						    elem1.innerHTML = '';
		   					var newTable = elem1.append(newElemC);
		
						    var elem = document.getElementById('sotr');
						    elem.innerHTML = '';
		   					var newTable = elem.append(newElem);
						   	elem1.style.overflowY = (elem.scrollHeight !=elem.offsetHeight)? 'scroll' :'hidden';
						}
				
						if ( ee >2 )  { // Получение ссылки и скачивание файла 
						    var div = document.getElementById('info');
							var a    = document.createElement('a');
						    a.href = responseData.url;
						    document.getElementById("lb").innerHTML = '';
						    a.appendChild(document.createTextNode(' Скачать файл '));
						    div.appendChild(a);
							a.click();  // скачивание файла 
						    a.remove(); // удаление ссылки на скачивание
						}

						document.getElementById("svg").style.display = 'none';
						document.getElementById("button").disabled = false;
						document.getElementById("textarea").focus();			
						return responseData;
					});
	}

// Обработка ошибок
    function onError(e) { console.log('Error', e);}
